#!/bin/sh
cd /app/server && node dist/index.js &
cd /app/frontend && npm start