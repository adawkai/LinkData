#!/usr/bin/env bash
set -euo pipefail

bucket="${S3_BUCKET:-avatars}"
region="${AWS_DEFAULT_REGION:-us-east-1}"

echo "Creating bucket: ${bucket}"
awslocal s3api create-bucket --bucket "${bucket}" --region "${region}" 2>/dev/null || true

echo "Setting bucket CORS"
awslocal s3api put-bucket-cors --bucket "${bucket}" --cors-configuration '{
  "CORSRules": [
    {
      "AllowedOrigins": ["http://localhost:5173"],
      "AllowedMethods": ["GET", "PUT", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}'

echo "Setting public-read bucket policy (dev only)"
awslocal s3api put-bucket-policy --bucket "${bucket}" --policy "{
  \"Version\": \"2012-10-17\",
  \"Statement\": [
    {
      \"Sid\": \"PublicReadGetObject\",
      \"Effect\": \"Allow\",
      \"Principal\": \"*\",
      \"Action\": \"s3:GetObject\",
      \"Resource\": \"arn:aws:s3:::${bucket}/*\"
    }
  ]
}"

echo "LocalStack S3 ready"

