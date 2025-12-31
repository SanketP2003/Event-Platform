# Event Platform

A full-stack MERN application for creating, managing, and attending events with real-time RSVP functionality and concurrency handling.

## Features Implemented

- **User Authentication**: Registration, login, and JWT-based authentication.
- **Event Management**: Create events with title, description, date, location, capacity, and category.
- **Event Discovery**: Browse events with search, category filtering, and sorting by date or popularity.
- **RSVP System**: Attend events with capacity limits and concurrency protection.
- **User Profiles**: View personal information and lists of attending/created events with sorting.
- **Theme Toggle**: Switch between light and dark modes with persistence.
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS.
- **Real-time Updates**: Automatic UI updates after RSVP actions.

## Running the Application Locally

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory.

2. **Set up the backend:**
   ```bash
   cd server
   npm install
   ```
   - Create a `.env` file in the `server` directory with:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     ```
   - Start the server:
     ```bash
     node index.js
     ```
     The server will run on `http://localhost:5000`.

3. **Set up the frontend:**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   The client will run on `http://localhost:5173`.

4. **Access the application:**
   - Open `http://localhost:5173` in your browser.
   - Register a new account or log in.
   - Create events, browse, and RSVP.

### Notes
- Ensure MongoDB is running locally or provide a valid Atlas URI.
- The application uses Vite for the frontend and Express for the backend.
- CORS is handled via proxy in Vite config for local development.

## Technical Explanation: RSVP Capacity and Concurrency Challenge

### Problem
The RSVP system must handle concurrent requests to prevent overbooking beyond capacity and avoid duplicate RSVPs for the same user. Traditional read-then-update approaches can lead to race conditions in high-traffic scenarios.

### Solution Strategy
We use MongoDB's atomic `findOneAndUpdate` operation with conditional queries to ensure thread-safe updates. This leverages MongoDB's document-level atomicity to handle concurrency without external locking mechanisms.

### Code Implementation
The RSVP endpoint in `server/routes/events.js` uses the following approach:

```javascript
router.post('/rsvp/:id', auth, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  try {
    const event = await Event.findOneAndUpdate(
      { 
        _id: eventId, 
        $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] },  // Check capacity
        attendees: { $ne: userId }  // Ensure user not already attending
      },
      { $push: { attendees: userId } },  // Add user to attendees
      { new: true }
    );

    if (!event) {
      // Handle cases: already attending or event full
      const checkEvent = await Event.findById(eventId);
      if (checkEvent && checkEvent.attendees.includes(userId)) {
        return res.status(400).json({ message: 'You have already joined this event' });
      }
      return res.status(400).json({ message: 'Event is full or unavailable' });
    }

    res.json({ message: 'RSVP Successful', event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

### Key Technical Details
- **Atomicity**: `findOneAndUpdate` performs the query and update in a single atomic operation, preventing race conditions.
- **Conditional Updates**: The query includes `$expr: { $lt: [{ $size: "$attendees" }, "$capacity"] }` to check capacity and `attendees: { $ne: userId }` to prevent duplicates.
- **Concurrency Handling**: Multiple concurrent requests are serialized at the database level, ensuring only valid RSVPs succeed.
- **Error Handling**: Fallback checks provide clear error messages for edge cases.
- **Performance**: No external locks or transactions needed; MongoDB handles isolation internally.

This approach ensures data integrity and scalability for RSVP operations under concurrent load.
