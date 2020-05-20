module.exports = {
    apps: [{
        name: "VideoConferenceApp",
        script: "./bin/www",
        watch: true,
        instances: 1,
        autorestart: true,
        max_memory_restart: '1G',
        env: {
            "PORT": 3012,
            "NODE_ENV": "development",
            "API_URL": "http://192.168.12.8/mylabconnectx7scripts/",
            "LOG_URL": "http://210.18.132.90:81/axpertwebx6scripts/",
            "APP_TYPE": "b2c",
            "ACCESS_KEY": "PT75SZ0M4KUWUGOKLLE9",
            "SECRET_KEY": "eBMn6KWWph8ZjcIOHQDZ7uVe5BmvQ7eDc6wBHCP7",
            "SERVER_NAME": "s3.us-east-1.wasabisys.com",
            "BUCKET_NAME": "easydentconnect",
            "S3_REGION": "us-east-1",
            "JWT_SECRET": "PT75SZ0M4KUWUGOKLLE9"
        },
        env_production: {
            "PORT": 3020,
            "NODE_ENV": "production",
            "API_URL": "https://beta.mylabconnect.com/mylabconnectscriptsbeta/",
            "APP_TYPE": "b2c",
            "ACCESS_KEY": "PT75SZ0M4KUWUGOKLLE9",
            "SECRET_KEY": "eBMn6KWWph8ZjcIOHQDZ7uVe5BmvQ7eDc6wBHCP7",
            "SERVER_NAME": "s3.us-east-1.wasabisys.com",
            "BUCKET_NAME": "easydentconnect",
            "S3_REGION": "us-east-1"
        }
    }]
}