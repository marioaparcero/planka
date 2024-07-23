import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const localizer = momentLocalizer(moment);

function MyCalendar() {
  const [events, setEvents] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjE2OWY5MmU4LTdlYWQtNGY5NC05NGY4LTQ3ZWExNDFjZjFjNCJ9.eyJpYXQiOjE3MjA2MDQyNTMsInN1YiI6IjEyNzEzNzE5OTQ3NzU5NDYyNDEiLCJleHAiOjE3NTIxNDAyNTN9.39L23QDOkqqhWYZvawUkSXXGNiGs94U1RdDxFn-xrhA';

    async function getProjectUsers() {
      try {
        const response = await axios
          .get(`http://localhost:1337/api/boards/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            res.data.included.cards.forEach((cardData) => {
              const fechaInicio = new Date(cardData.createdAt);
              const fechaFin = new Date(cardData.dueDate);
              const taskObj = {
                title: cardData.name,
                start: new Date(
                  fechaInicio.getFullYear(),
                  fechaInicio.getMonth(),
                  fechaInicio.getDate(),
                  fechaInicio.getHours(),
                  fechaInicio.getMinutes(),
                ),
                end: new Date(
                  fechaFin.getFullYear(),
                  fechaFin.getMonth(),
                  fechaFin.getDate(),
                  fechaFin.getHours(),
                  fechaFin.getMinutes(),
                ),
              };
              setEvents((value) => [...value, taskObj]);
            });
          });
        return response;
      } catch (error) {
        console.error(
          'Error al obtener los usuarios del proyecto:',
          error.response ? error.response.data : error.message,
        );
        throw error;
      }
    }

    getProjectUsers();
  }, [id]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 120px)', width: '95vw' }}
      />
    </div>
  );
}

export default MyCalendar;
