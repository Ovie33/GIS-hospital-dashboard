Hospital GIS Dashboard Objective

Build a mini dashboard that visualizes hospital locations and dynamically identifies the nearest ambulance using spatial queries.

Overview

This project is a GIS-based dashboard that displays hospitals on an interactive map and calculates the closest ambulance to a selected hospital in real time. Proximity is determined using PostGIS spatial functions and optimized with Redis caching for performance.

The system recalculates proximity dynamically based on current locations rather than fixed assignments.

Tech Stack Frontend: React, TypeScript, Vite, Leaflet

Backend: Node.js, Express, TypeScript

Database: PostgreSQL with PostGIS

Caching: Redis (Memurai)

Features

Interactive map displaying hospital locations

Click a hospital to find the nearest ambulance

Accurate distance calculation using PostGIS geography functions

Redis caching for repeated proximity queries

Cache invalidation when ambulance locations change

Simple dashboard layout with sidebar and map view

How Proximity Works When a hospital is selected, the backend checks Redis for a cached result. If no cache exists, PostGIS calculates the distance between the hospital and all ambulances using real-world geographic coordinates and returns the closest one. The result is cached temporarily for faster subsequent requests.

API Endpoints

Get all hospitals

GET /hospitals

Get nearest ambulance to a hospital

GET /hospitals/:id/nearest-ambulance

Move an ambulance (simulate real-time updates)

POST /ambulances/:id/move

Request body:

{ "lat": 4.8200, "lng": 7.0200 }

Setup Instructions

Prerequisites

Node.js (v18+)

PostgreSQL

PostGIS

Redis (Memurai)

Backend Setup

cd backend

npm install

npm run db:setup

npm run dev

Create a .env file:

PORT=5000

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/hospital_gis

REDIS_URL=redis://localhost:6379

Frontend Setup

cd frontend

npm install

npm run dev

Notes

Ambulance proximity is calculated dynamically and not permanently assigned.

Redis caching improves performance for repeated proximity queries.

Cache is invalidated whenever ambulance locations are updated.

Conclusion

This project demonstrates the use of spatial databases, backend performance optimization, and frontend map visualization to solve a real-world proximity problem using clean TypeScript architecture.
