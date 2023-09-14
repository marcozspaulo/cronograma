const express = require('express');
const app = express();
const { google } = require('googleapis');

const PORT = 3000;
const API_KEY = 'AIzaSyAZ-kBaD5Jya781NBIOl5Ur0Ev0m7mDQe8';

app.get('/events', async (req, res) => {
  const calendar = google.calendar({ version: 'v3', auth: API_KEY });

  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;
    res.json(events);
  } catch (error) {
    console.log(error);
    res.status(500).send('Erro ao buscar eventos do Google Agenda.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});