# AWS Deployment Guide - Warehouse Management SaaS

This guide provides step-by-step instructions for deploying the Warehouse Management SaaS platform to AWS.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Load Balancer               │
│                    (HTTPS with SSL Certificate)             │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
    ┌─────▼─────┐            ┌─────▼─────┐
    │  EC2      │            │  EC2      │
    │  Instance │            │  Instance │
    │  (App)    │            │  (App)    │
    └─────┬─────┘            └─────┬─────┘
          │                         │
          └────────────┬────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
    ┌─────▼─────┐            ┌─────▼─────┐
    │  RDS      │            │ MongoDB   │
    │  MySQL    │            │  Atlas    │
    └───────────┘            └───────────┘
```

---

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Domain name (optional, for custom domain)
- MongoDB Atlas account (or self-hosted MongoDB)

---

## Step 1: Set Up RDS MySQL Database

### 1.1 Create RDS Instance

```bash
aws rds create-db-instance \
  --db-instance-identifier warehouse-mysql \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0 \
  --master-username admin \
  --master-user-password YourSecurePassword123! \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name your-subnet-group \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "mon:04:00-mon:05:00" \
  --publicly-accessible \
  --storage-encrypted
```

### 1.2 Create Database

Once RDS is available, connect and create the database:

```bash
mysql -h warehouse-mysql.xxxxxxxxx.us-east-1.rds.amazonaws.com \
  -u admin -p

CREATE DATABASE warehouse_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 1.3 Run Schema

```bash
mysql -h warehouse-mysql.xxxxxxxxx.us-east-1.rds.amazonaws.com \
  -u admin -p warehouse_db < src/main/resources/db/schema.sql
```

---

## Step 2: Set Up MongoDB Atlas

### 2.1 Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 Free tier for testing)
3. Create database user
4. Whitelist IP addresses (or use 0.0.0.0/0 for testing)

### 2.2 Get Connection String

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/warehouse_audit?retryWrites=true&w=majority
```

---

## Step 3: Build Application

### 3.1 Build WAR File

```bash
cd "/Users/shivdev/Desktop/Spring/warehouse management"
mvn clean package -DskipTests
```

This creates: `target/warehouse-management-saas-1.0.0.war`

---

## Step 4: Set Up EC2 Instances

### 4.1 Launch EC2 Instance

```bash
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.small \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --subnet-id subnet-xxxxxxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=warehouse-app-1}]' \
  --user-data file://user-data.sh
```

### 4.2 User Data Script (user-data.sh)

```bash
#!/bin/bash
# Update system
yum update -y

# Install Java 17
amazon-linux-extras enable java-openjdk17
yum install -y java-17-openjdk

# Install Tomcat 10
cd /opt
wget https://dlcdn.apache.org/tomcat/tomcat-10/v10.1.17/bin/apache-tomcat-10.1.17.tar.gz
tar -xzf apache-tomcat-10.1.17.tar.gz
mv apache-tomcat-10.1.17 tomcat
rm apache-tomcat-10.1.17.tar.gz

# Create tomcat user
useradd -r -m -U -d /opt/tomcat -s /bin/false tomcat
chown -R tomcat:tomcat /opt/tomcat

# Create systemd service
cat > /etc/systemd/system/tomcat.service << 'EOF'
[Unit]
Description=Apache Tomcat Web Application Container
After=network.target

[Service]
Type=forking
User=tomcat
Group=tomcat

Environment="JAVA_HOME=/usr/lib/jvm/java-17-openjdk"
Environment="CATALINA_HOME=/opt/tomcat"
Environment="CATALINA_BASE=/opt/tomcat"
Environment="CATALINA_OPTS=-Xms512M -Xmx1024M -server -XX:+UseParallelGC"

ExecStart=/opt/tomcat/bin/startup.sh
ExecStop=/opt/tomcat/bin/shutdown.sh

[Install]
WantedBy=multi-user.target
EOF

# Enable and start Tomcat
systemctl daemon-reload
systemctl enable tomcat
systemctl start tomcat

# Install CloudWatch agent (optional)
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
rpm -U ./amazon-cloudwatch-agent.rpm
```

### 4.3 Deploy Application

```bash
# Copy WAR file to EC2
scp -i your-key.pem target/warehouse-management-saas-1.0.0.war \
  ec2-user@your-ec2-ip:/tmp/

# SSH to EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Deploy to Tomcat
sudo cp /tmp/warehouse-management-saas-1.0.0.war /opt/tomcat/webapps/api.war
sudo systemctl restart tomcat
```

### 4.4 Configure Environment Variables

Create `/opt/tomcat/bin/setenv.sh`:

```bash
#!/bin/bash
export SPRING_PROFILES_ACTIVE=prod
export DB_URL="jdbc:mysql://warehouse-mysql.xxxxxxxxx.us-east-1.rds.amazonaws.com:3306/warehouse_db"
export DB_USERNAME="admin"
export DB_PASSWORD="YourSecurePassword123!"
export MONGODB_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/warehouse_audit"
export JWT_SECRET="your-256-bit-secret-key-change-this-in-production"
```

Make it executable:
```bash
chmod +x /opt/tomcat/bin/setenv.sh
```

---

## Step 5: Set Up Application Load Balancer

### 5.1 Create Target Group

```bash
aws elbv2 create-target-group \
  --name warehouse-tg \
  --protocol HTTP \
  --port 8080 \
  --vpc-id vpc-xxxxxxxxx \
  --health-check-path /api/actuator/health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3
```

### 5.2 Register Targets

```bash
aws elbv2 register-targets \
  --target-group-arn arn:aws:elasticloadbalancing:... \
  --targets Id=i-xxxxxxxxx Id=i-yyyyyyyyy
```

### 5.3 Create Load Balancer

```bash
aws elbv2 create-load-balancer \
  --name warehouse-alb \
  --subnets subnet-xxxxxxxxx subnet-yyyyyyyyy \
  --security-groups sg-xxxxxxxxx \
  --scheme internet-facing \
  --type application
```

### 5.4 Create Listener

```bash
# HTTP Listener (redirect to HTTPS)
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=redirect,RedirectConfig={Protocol=HTTPS,Port=443,StatusCode=HTTP_301}

# HTTPS Listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

---

## Step 6: Configure Security Groups

### 6.1 ALB Security Group

```bash
# Allow HTTP from anywhere
aws ec2 authorize-security-group-ingress \
  --group-id sg-alb \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Allow HTTPS from anywhere
aws ec2 authorize-security-group-ingress \
  --group-id sg-alb \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0
```

### 6.2 EC2 Security Group

```bash
# Allow traffic from ALB only
aws ec2 authorize-security-group-ingress \
  --group-id sg-ec2 \
  --protocol tcp \
  --port 8080 \
  --source-group sg-alb
```

### 6.3 RDS Security Group

```bash
# Allow MySQL from EC2 instances
aws ec2 authorize-security-group-ingress \
  --group-id sg-rds \
  --protocol tcp \
  --port 3306 \
  --source-group sg-ec2
```

---

## Step 7: SSL Certificate (Optional)

### 7.1 Request Certificate in ACM

```bash
aws acm request-certificate \
  --domain-name warehouse.yourdomain.com \
  --validation-method DNS \
  --subject-alternative-names "*.warehouse.yourdomain.com"
```

### 7.2 Validate Certificate

Follow DNS validation instructions in ACM console.

---

## Step 8: Auto Scaling (Optional)

### 8.1 Create Launch Template

```bash
aws ec2 create-launch-template \
  --launch-template-name warehouse-template \
  --version-description "v1" \
  --launch-template-data file://launch-template.json
```

### 8.2 Create Auto Scaling Group

```bash
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name warehouse-asg \
  --launch-template LaunchTemplateName=warehouse-template,Version=1 \
  --min-size 2 \
  --max-size 4 \
  --desired-capacity 2 \
  --target-group-arns arn:aws:elasticloadbalancing:... \
  --vpc-zone-identifier "subnet-xxxxxxxxx,subnet-yyyyyyyyy"
```

---

## Step 9: Monitoring and Logging

### 9.1 CloudWatch Logs

Configure application to send logs to CloudWatch:

Add to `application-prod.yml`:
```yaml
logging:
  file:
    name: /var/log/warehouse/application.log
```

### 9.2 CloudWatch Metrics

Enable detailed monitoring for EC2 instances:
```bash
aws ec2 monitor-instances --instance-ids i-xxxxxxxxx
```

---

## Step 10: Backup Strategy

### 10.1 RDS Automated Backups

Already configured with 7-day retention.

### 10.2 MongoDB Atlas Backups

Configure in MongoDB Atlas console (automatic for M10+ clusters).

---

## Cost Estimation (Monthly)

| Service | Configuration | Estimated Cost |
|---------|--------------|----------------|
| EC2 (2x t3.small) | 2 vCPU, 2 GB RAM | ~$30 |
| RDS MySQL (db.t3.micro) | 1 vCPU, 1 GB RAM | ~$15 |
| MongoDB Atlas (M0) | Free tier | $0 |
| ALB | Standard | ~$20 |
| Data Transfer | ~100 GB/month | ~$10 |
| **Total** | | **~$75/month** |

---

## Post-Deployment Checklist

- [ ] Verify application is accessible via ALB
- [ ] Test all API endpoints
- [ ] Check CloudWatch logs
- [ ] Verify database connectivity
- [ ] Test auto-scaling (if configured)
- [ ] Set up monitoring alerts
- [ ] Configure backup verification
- [ ] Document credentials securely
- [ ] Set up CI/CD pipeline (optional)

---

## Troubleshooting

### Application won't start
```bash
# Check Tomcat logs
sudo tail -f /opt/tomcat/logs/catalina.out

# Check if port is listening
sudo netstat -tlnp | grep 8080
```

### Database connection issues
```bash
# Test MySQL connection
mysql -h your-rds-endpoint -u admin -p

# Check security groups
aws ec2 describe-security-groups --group-ids sg-xxxxxxxxx
```

### High memory usage
```bash
# Adjust JVM settings in setenv.sh
export CATALINA_OPTS="-Xms256M -Xmx512M -server"
```

---

## Maintenance

### Update Application

```bash
# Build new version
mvn clean package -DskipTests

# Deploy to EC2
scp -i your-key.pem target/warehouse-management-saas-1.0.0.war \
  ec2-user@your-ec2-ip:/tmp/

# SSH and deploy
ssh -i your-key.pem ec2-user@your-ec2-ip
sudo cp /tmp/warehouse-management-saas-1.0.0.war /opt/tomcat/webapps/api.war
sudo systemctl restart tomcat
```

### Database Migrations

```bash
# Run migration scripts
mysql -h your-rds-endpoint -u admin -p warehouse_db < migration.sql
```

---

## Security Best Practices

1. **Use Secrets Manager**: Store database credentials in AWS Secrets Manager
2. **Enable WAF**: Add AWS WAF to ALB for DDoS protection
3. **Rotate Credentials**: Regularly rotate database and JWT secrets
4. **Enable MFA**: Enable MFA for AWS console access
5. **Audit Logs**: Enable CloudTrail for AWS API auditing
6. **Encrypt Data**: Enable encryption at rest for RDS and EBS volumes
7. **Network Isolation**: Use private subnets for EC2 and RDS

---

## Support

For issues or questions:
- Check CloudWatch logs
- Review application logs in `/opt/tomcat/logs/`
- Contact: support@warehouse-saas.com
