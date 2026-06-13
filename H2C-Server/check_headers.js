const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYXpxbXd0dHV2bGZ4b3liYmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMjkwOTEsImV4cCI6MjA5NjkwNTA5MX0.APkpMLV-sMIaZTZA5y7J9zYNvRVAMThkM3eNwy4PU9M';

const parts = jwt.split('.');
const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
console.log('Decoded JWT payload:');
console.log(JSON.stringify(payload, null, 2));
