## 📌 Features

### 🔐 Authentication
- Login & Register using Express backend  
- Secure **HttpOnly cookies** for HTTP authentication  
- Separate **WebSocket token (`wsToken`)** for real-time auth  
- Protected client routes using **Next.js middleware**

---

### 🏠 Rooms System
- Create new chat rooms  
- Join existing rooms using a room **slug**  
- Rooms stored internally using a numeric `id` for efficient lookups  
- Automatic membership handling:
  - Creator is added as the first member  
  - Others join through the `join room` API  
- Fully protected system:
  - Users **must be members** to access or chat  
  - Unauthorized joins/messages are blocked  

---

### 💬 Real-Time Messaging
- Real-time chat via **WebSockets (`ws`)**  
- WebSocket server validates JWT tokens on connection  
- Messages broadcast only to **members of the specific room**  
- Live message updates in the UI  
- Automatic room-level socket tracking  
- Security checks:
  - ❌ Cannot join room without membership  
  - ❌ Cannot send messages without membership  

---

### 🗄️ Database (Prisma + PostgreSQL)
- Models:
  - **User**
  - **Room**
  - **RoomMember**
  - **Message**  
- Efficient relational queries with Prisma  
- Messages stored with user + room relations  
- Membership enforced at DB level and WS level  

---

### 💻 Frontend (Next.js App Router)
- Modern, fully responsive UI  
- Landing page to create or join rooms  
- Dedicated room page with real-time chat  
- Smooth autoscroll chat experience  
- Clean TailwindCSS design  

---

### 🧱 Architecture
- **Turborepo Monorepo** with clean separation:
  - `apps/frontend`
  - `apps/http-backend`
  - `apps/ws-backend`
- Shared packages:
  - `@repo/prisma`
  - `@repo/backend-common/types`
  - `@repo/jwt-common`
  - `@repo/jwt-ws`
- Centralized types + shared logic across the stack  

---

### 🛠️ Tech Stack

#### **Frontend**
- Next.js (App Router)  
- React  
- TailwindCSS  
- Axios  
- WebSockets (client)

#### **Backend (HTTP)**
- Node.js + Express  
- JWT Auth (HttpOnly Cookies)  
- Zod validation  
- Prisma ORM  
- PostgreSQL  
- CORS  
- cookie-parser  

#### **WebSocket Server**
- Node.js + `ws`  
- JWT-based WebSocket authentication  
- Room-level broadcasting  

#### **Infrastructure**
- Turborepo  
- Shared packages system

#### **DB**
- NeonDB
