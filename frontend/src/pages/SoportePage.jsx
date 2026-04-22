import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiSend } from 'react-icons/fi';
import styles from './SoportePage.module.css';
import api from '../services/axiosConfig';

export default function SoportePage() {
  // --- ESTADOS DEL ACORDEÓN (FAQs) ---
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // --- ESTADOS DEL FORMULARIO ---
  const [ticket, setTicket] = useState({
    tipoConsulta: '',
    asunto: '',
    mensaje: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState({ texto: '', tipo: '' });

  // Lista estática de Preguntas Frecuentes
  const faqs = [
    {
      pregunta: "¿Cómo exporto mis facturas a PDF?",
      respuesta: "Ve a la sección de 'Ingresos > Facturas Emitidas', selecciona la factura que deseas descargar y haz clic en el botón 'Exportar a PDF' situado en la parte superior derecha de la tabla."
    },
    {
      pregunta: "¿Cómo cambio mi contraseña?",
      respuesta: "Puedes modificarla en cualquier momento desde la sección de 'Ajustes' en el menú lateral. Necesitarás introducir tu contraseña actual por seguridad antes de establecer la nueva."
    },
    {
      pregunta: "¿Qué ocurre si elimino un cliente o proveedor?",
      respuesta: "El contacto desaparecerá de tu listado principal de 'Maestros' para no ensuciar tu vista, pero las facturas que ya hayas emitido o recibido a su nombre se conservarán intactas por motivos fiscales y legales."
    },
    {
      pregunta: "¿Cuánto tardan en responder a los tickets?",
      respuesta: "Nuestro equipo de soporte técnico revisa las incidencias diariamente. El tiempo medio de respuesta es de 24 a 48 horas laborables."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const mostrarAlerta = (texto, tipo) => {
    setMensajeAlerta({ texto, tipo });
    setTimeout(() => setMensajeAlerta({ texto: '', tipo: '' }), 5000);
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    
    if (!ticket.tipoConsulta || !ticket.asunto || !ticket.mensaje) {
      mostrarAlerta('Por favor, rellena todos los campos', 'error');
      return;
    }

    try {
      setIsLoading(true);
      await api.post('/soporte/ticket', ticket);
      mostrarAlerta('Mensaje enviado correctamente', 'success');
      setTicket({ tipoConsulta: '', asunto: '', mensaje: '' });
    } catch (error) {
      console.error('Error al enviar ticket:', error);
      mostrarAlerta('Hubo un error al enviar el mensaje. Inténtalo de nuevo.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.soporteContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Ayuda y Soporte</h1>
        <p className={styles.pageSubtitle}>Encuentra respuestas rápidas o contacta con nuestro equipo técnico.</p>
      </div>

      <div className={styles.twoColumnGrid}>
        
        {/* COLUMNA IZQUIERDA: FAQs */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Preguntas Frecuentes</h2>
          <div className={styles.accordionContainer}>
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`${styles.accordionItem} ${openFaqIndex === index ? styles.itemOpen : ''}`}
              >
                <button 
                  className={styles.accordionHeader} 
                  onClick={() => toggleFaq(index)}
                  type="button"
                >
                  <span className={styles.questionText}>{faq.pregunta}</span>
                  {openFaqIndex === index ? (
                    <FiChevronUp className={styles.chevronIcon} />
                  ) : (
                    <FiChevronDown className={styles.chevronIcon} />
                  )}
                </button>
                
                {/* Contenido desplegable */}
                <div 
                  className={styles.accordionContent}
                  style={{ maxHeight: openFaqIndex === index ? '200px' : '0' }}
                >
                  <p className={styles.answerText}>{faq.respuesta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO TICKET */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Abrir un Ticket</h2>
          <p className={styles.formHelpText}>
            ¿No encontraste lo que buscabas? Explícanos tu problema y te ayudaremos lo antes posible.
          </p>

          <form className={styles.ticketForm} onSubmit={handleSubmitTicket}>
            
            <div className={styles.formGroup}>
              <label>Tipo de consulta</label>
              <select 
                value={ticket.tipoConsulta} 
                onChange={(e) => setTicket({...ticket, tipoConsulta: e.target.value})}
                className={styles.inputElement}
                required
              >
                <option value="" disabled>Selecciona una opción...</option>
                <option value="Duda técnica">Duda técnica</option>
                <option value="Problema con facturas">Problema con facturas</option>
                <option value="Sugerencia">Sugerencia</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Asunto</label>
              <input 
                type="text" 
                placeholder="Ej: Error al generar un presupuesto"
                value={ticket.asunto}
                onChange={(e) => setTicket({...ticket, asunto: e.target.value})}
                className={styles.inputElement}
                maxLength="80"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Mensaje</label>
              <textarea 
                placeholder="Explica detalladamente tu problema o consulta..."
                value={ticket.mensaje}
                onChange={(e) => setTicket({...ticket, mensaje: e.target.value})}
                className={`${styles.inputElement} ${styles.textareaElement}`}
                required
              />
            </div>

            <div className={styles.buttonRow}>
              <button type="submit" disabled={isLoading} className={styles.btnGreen}>
                <FiSend size={18} />
                Enviar Mensaje
              </button>
              
              {/* ALERTA EN LÍNEA*/}
              {mensajeAlerta.texto && (
                <span className={`${styles.inlineAlert} ${mensajeAlerta.tipo === 'error' ? styles.alertError : styles.alertSuccess}`}>
                  {mensajeAlerta.texto}
                </span>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}