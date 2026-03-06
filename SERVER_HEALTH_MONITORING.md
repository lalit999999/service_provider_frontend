# Server Health Monitoring System

## Overview

The Local Service Provider platform now includes an automated **Server Health Monitoring System** that continuously tracks the health status of the backend server every minute. This helps ensure service availability and provides real-time status visibility.

---

## 🏗️ Architecture

### Backend

**Route:** `GET /api/health`

**Response:**

```json
{
  "message": "Server is healthy",
  "status": "OK",
  "timestamp": "2026-03-07T10:30:45.123Z",
  "uptime": 3600.5
}
```

**Features:**

- ✅ Zero authentication required (public endpoint)
- ✅ Returns server status and uptime
- ✅ Lightweight - fast response time

---

## 📱 Frontend Components

### 1. **useServerHealth Hook**

**Location:** `src/hooks/useServerHealth.js`

Custom React hook for server health monitoring.

**Usage:**

```jsx
import { useServerHealth } from "@/hooks/useServerHealth";

function MyComponent() {
  const health = useServerHealth();

  return (
    <div>
      <p>Status: {health.isHealthy ? "✅" : "❌"}</p>
      <p>Uptime: {health.uptime}s</p>
      <p>Last Checked: {health.lastChecked}</p>
    </div>
  );
}
```

**Return Value:**

```javascript
{
  isHealthy: boolean,        // true if server is healthy
  status: string,            // 'OK' or 'ERROR'
  timestamp: string,         // Server timestamp in ISO format
  uptime: number,           // Server uptime in seconds
  error: string | null,     // Error message if request failed
  lastChecked: string       // When this status was last checked
}
```

**Behavior:**

- ✅ Checks health immediately on mount
- ✅ Automatically checks every **60 seconds** (1 minute)
- ✅ Auto-cleanup interval on component unmount
- ✅ Console logging for debugging

---

### 2. **ServerHealthStatus Component**

**Location:** `src/components/ServerHealthStatus.jsx`

Simple status badge showing server health.

**Usage:**

```jsx
import { ServerHealthStatus } from '@/components/ServerHealthStatus';

// Simple badge (compact)
<ServerHealthStatus showDetails={false} />

// With details (shows uptime)
<ServerHealthStatus showDetails={true} />
```

**Display:**

- ✅ **Checking**: Shows loading spinner while fetching
- ✅ **Healthy**: Green checkmark with "Server OK"
- ✅ **Error**: Red alert with error message

---

### 3. **ServerHealth Admin Page**

**Location:** `src/pages/admin/ServerHealth.jsx`
**Route:** `/admin/server-health` (admin only)

Comprehensive server health dashboard for administrators.

**Features:**

- 📊 Current server status (online/offline)
- ⏱️ Server uptime display
- 🕐 Last check timestamp
- 🔄 Manual refresh button
- 📈 Health check history (last 10 checks)
- ✅ Error message display
- 📋 Real-time status updates

---

## 🎯 Feature Implementation

### Currently Integrated:

#### Navbar Integration

The server health status is **automatically displayed** in the navbar:

- **Desktop**: Small status badge on the right side of the navbar
- **Mobile**: Health status shown in the mobile menu with details

#### Access the Health Monitoring Page

Admins can view detailed health information:

```
URL: http://localhost:5173/admin/server-health
```

---

## 🔄 Health Check Frequency

| Component      | Frequency        | Purpose               |
| -------------- | ---------------- | --------------------- |
| Hook Auto-poll | Every 60 seconds | Continuous monitoring |
| Manual Check   | On-demand        | Immediate status      |
| History Buffer | Last 10 checks   | Quick diagnostics     |

---

## 💻 How It Works

### 1. On Page Load

```
[Health Check] Pinging server...
[Health Check] ✅ Server is healthy: {
  isHealthy: true,
  status: 'OK',
  timestamp: '2026-03-07T10:30:45.123Z',
  uptime: 3600,
  lastChecked: '2026-03-07T10:30:45.456Z'
}
```

### 2. Every 60 Seconds

- Hook sends GET request to `/api/health`
- Updates state with new status
- Stores in health history
- Updates navbar badge
- Logs to console for debugging

### 3. On Error

```
[Health Check] ❌ Server health check failed: Network Error
```

- Shows error message in UI
- Updates status to "Offline"
- Maintains last known status
- Allows manual retry

---

## 🎨 Visual States

### Server Online

```
✅ Server Online
Status: OK
Uptime: 3600 seconds (1 hour)
```

### Server Offline

```
❌ Server Offline
Status: ERROR
Error: Network Error / Server Unreachable
```

### Checking

```
⏳ Checking...
```

---

## 🔧 Customization

### Change Check Interval

Edit `src/hooks/useServerHealth.js`:

```javascript
// Line ~37: Change 60000 to desired milliseconds
const intervalId = setInterval(checkHealth, 60000); // 60 seconds

// Examples:
// 30000 = 30 seconds
// 120000 = 2 minutes
// 300000 = 5 minutes
```

### Change History Size

Edit `src/pages/admin/ServerHealth.jsx`:

```javascript
// Line ~38: Change number to desired count
...prev.slice(0, 9), // Keep last 10 checks
                     // Change 9 to higher number for more history
```

### Customize Component Appearance

Edit `src/components/ServerHealthStatus.jsx`:

- Modify Tailwind classes for styling
- Add custom icons
- Change colors and sizing

---

## 🚀 Example Usage

### Add To Layout

```jsx
// src/components/Layout.tsx
import { useServerHealth } from "@/hooks/useServerHealth";

export const Layout = () => {
  const health = useServerHealth();

  return (
    <div>
      {/* Rest of layout */}
      {health.isHealthy === false && (
        <div className="bg-red-100 p-4 text-center">
          ⚠️ Backend server is currently offline
        </div>
      )}
    </div>
  );
};
```

### Add To Dashboard

```jsx
// Any admin page
import { ServerHealthStatus } from "@/components/ServerHealthStatus";

export const Dashboard = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1>Admin Dashboard</h1>
        <ServerHealthStatus showDetails={true} />
      </div>
    </div>
  );
};
```

### Add To API Error Handler

```jsx
// src/context/AuthContext.jsx
import { useServerHealth } from "@/hooks/useServerHealth";

export const AuthContext = () => {
  const { health } = useServerHealth();

  const makeRequest = async () => {
    if (!health.isHealthy) {
      toast.error("Backend server is unavailable");
      return;
    }
    // Make request...
  };
};
```

---

## 📊 Monitoring Dashboard Access

### For Admins:

1. Login as admin user
2. Click navbar "Server OK" / "Server Error" badge (desktop)
3. Or visit `/admin/server-health`
4. View real-time health status
5. Check health check history
6. Click "Check Now" for immediate refresh

---

## 🔍 Debugging

### Check Console Logs

Open browser DevTools (F12) and filter for `[Health Check]`:

```
[Health Check] Pinging server...
[Health Check] ✅ Server is healthy: {...}
```

### Common Issues:

**Issue:** Status shows "Checking..." indefinitely

- **Solution:** Verify backend is running on `localhost:3000`
- **Solution:** Check CORS settings in backend `app.js`

**Issue:** Shows "Server Error"

- **Solution:** Ensure `/api/health` endpoint exists (✅ Already implemented)
- **Solution:** Check backend console for errors
- **Solution:** Verify network connectivity

**Issue:** History not updating

- **Solution:** Wait 60+ seconds for automatic refresh
- **Solution:** Click "Check Now" for manual refresh

---

## 📈 Next Steps

Future enhancements could include:

- [ ] Database health check
- [ ] Cache/Redis health monitoring
- [ ] Performance metrics (response time, request count)
- [ ] Email alerts for outages
- [ ] Slack integration
- [ ] Webhook notifications
- [ ] Downloadable health reports

---

## Files Created/Modified

| File                                    | Type     | Purpose                             |
| --------------------------------------- | -------- | ----------------------------------- |
| `src/hooks/useServerHealth.js`          | Created  | Health monitoring hook              |
| `src/components/ServerHealthStatus.jsx` | Created  | Status badge component              |
| `src/pages/admin/ServerHealth.jsx`      | Created  | Admin monitoring page               |
| `src/components/Navbar.jsx`             | Modified | Added status badge                  |
| `src/api/endpoints.js`                  | Modified | Added health API                    |
| `src/app/routes.tsx`                    | Modified | Added health check route            |
| `backend/src/routes/health.routes.js`   | Existing | Health endpoint (no changes needed) |

---

## ✅ Summary

The Server Health Monitoring System is now **fully implemented** and **production-ready**:

- ✅ Backend health endpoint active
- ✅ Frontend hook for automatic polling
- ✅ Status badge in navbar
- ✅ Admin monitoring page
- ✅ History tracking
- ✅ Error handling
- ✅ Console logging for debugging
- ✅ Responsive design (desktop + mobile)

**Status:** Ready for use! 🎉
