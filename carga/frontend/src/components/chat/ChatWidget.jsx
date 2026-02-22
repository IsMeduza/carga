import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PremiumBotIcon, PremiumBotIconStatic } from '@/components/chat/BotIcon';
import {
  XIcon,
  SearchIcon,
  UserIcon,
  MapPinIcon,
  TruckIcon,
  ZapIcon,
  EuroIcon,
  SnowflakeIcon,
  RouteIcon,
  TargetIcon,
  TrendingUpIcon,
  MapIcon,
  WeightIcon,
  CheckCircleIcon,
  RefreshIcon,
  DownloadIcon,
  TrashIcon,
  LightbulbIcon,
  CommandIcon,
  SendIcon,
  MessageCircleIcon,
  ExpandIcon,
  MinusIcon,
  ResetIcon,
} from '@/components/Icons';

function EnhancedChatWidget({ open, setOpen, messages, input, setInput, onSend, loading, cargas, onAcceptCarga, setCurrentPage }) {
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  const dragHandleRef = useRef(null);

  // Chat features state
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [chatSize, setChatSize] = useState('normal'); // 'normal', 'fullscreen'

  // Drag state
  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // Resize state
  const [size, setSize] = useState({ width: 420, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset state when closing
  useEffect(() => {
    if (!open) {
      setChatSize('normal');
      setIsMinimized(false);
      setShowCommands(false);
      setShowHistory(false);
      setSearchQuery('');
    }
  }, [open]);

  // Reset position when size changes to fullscreen
  useEffect(() => {
    if (chatSize === 'fullscreen') {
      setPosition({ x: null, y: null });
    }
  }, [chatSize]);

  // Drag handlers
  const handleDragStart = useCallback((e) => {
    if (chatSize === 'fullscreen') return;

    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    const rect = chatWindowRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      posX: rect.left,
      posY: rect.top
    };

    e.preventDefault();
  }, [chatSize]);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    let newX = dragStartRef.current.posX + deltaX;
    let newY = dragStartRef.current.posY + deltaY;

    // Boundary constraints (keep at least 100px visible on all sides)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    newX = Math.max(-size.width + 100, Math.min(viewportWidth - 100, newX));
    newY = Math.max(-size.height + 100, Math.min(viewportHeight - 100, newY));

    setPosition({ x: newX, y: newY });
  }, [isDragging, size.width, size.height]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Resize handlers
  const handleResizeStart = useCallback((e, direction) => {
    if (chatSize === 'fullscreen') return;
    e.preventDefault();
    e.stopPropagation();

    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    const rect = chatWindowRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsResizing(true);
    setResizeDirection(direction);
    resizeStartRef.current = {
      x: clientX,
      y: clientY,
      width: rect.width,
      height: rect.height,
      posX: rect.left,
      posY: rect.top
    };
  }, [chatSize]);

  const handleResizeMove = useCallback((e) => {
    if (!isResizing || !resizeDirection) return;

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - resizeStartRef.current.x;
    const deltaY = clientY - resizeStartRef.current.y;

    let newWidth = resizeStartRef.current.width;
    let newHeight = resizeStartRef.current.height;
    let newX = position.x;
    let newY = position.y;

    // Handle different resize directions
    if (resizeDirection.includes('e')) {
      newWidth = Math.max(320, Math.min(800, resizeStartRef.current.width + deltaX));
    }
    if (resizeDirection.includes('w')) {
      const widthDelta = -deltaX;
      newWidth = Math.max(320, Math.min(800, resizeStartRef.current.width + widthDelta));
      if (newWidth !== resizeStartRef.current.width) {
        newX = resizeStartRef.current.posX + deltaX;
      }
    }
    if (resizeDirection.includes('s')) {
      newHeight = Math.max(400, Math.min(900, resizeStartRef.current.height + deltaY));
    }
    if (resizeDirection.includes('n')) {
      const heightDelta = -deltaY;
      newHeight = Math.max(400, Math.min(900, resizeStartRef.current.height + heightDelta));
      if (newHeight !== resizeStartRef.current.height) {
        newY = resizeStartRef.current.posY + deltaY;
      }
    }

    setSize({ width: newWidth, height: newHeight });
    if (newX !== position.x || newY !== position.y) {
      setPosition({ x: newX, y: newY });
    }
  }, [isResizing, resizeDirection, position.x, position.y]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeDirection(null);
  }, []);

  // Global mouse/touch events for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Global mouse/touch events for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.addEventListener('touchmove', handleResizeMove, { passive: false });
      document.addEventListener('touchend', handleResizeEnd);
      document.body.style.userSelect = 'none';

      // Set cursor based on direction
      const cursors = {
        'n': 'ns-resize', 's': 'ns-resize',
        'e': 'ew-resize', 'w': 'ew-resize',
        'ne': 'nesw-resize', 'sw': 'nesw-resize',
        'nw': 'nwse-resize', 'se': 'nwse-resize'
      };
      document.body.style.cursor = cursors[resizeDirection] || 'default';
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.removeEventListener('touchmove', handleResizeMove);
      document.removeEventListener('touchend', handleResizeEnd);
      if (!isDragging) {
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };
  }, [isResizing, resizeDirection, handleResizeMove, handleResizeEnd, isDragging]);

  // Reset position and size
  const resetPosition = () => {
    setPosition({ x: null, y: null });
    setSize({ width: 420, height: 600 });
  };

  const quickActions = [
    { icon: <ZapIcon />, label: 'Urgentes', query: 'Busca cargas urgentes disponibles', color: '#f97316' },
    { icon: <MapPinIcon />, label: 'Madrid', query: 'Cargas desde Madrid', color: '#3b82f6' },
    { icon: <TruckIcon />, label: 'Barcelona', query: 'Cargas hacia Barcelona', color: '#10b981' },
    { icon: <EuroIcon />, label: 'Rentables', query: 'Cargas con mejor precio por km', color: '#8b5cf6' },
    { icon: <SnowflakeIcon />, label: 'Frigorífico', query: 'Busca cargas frigoríficas', color: '#06b6d4' },
    { icon: <RouteIcon />, label: 'Cortas', query: 'Cargas de menos de 300km', color: '#ec4899' },
  ];

  const commands = [
    { cmd: '/urgentes', desc: 'Ver cargas urgentes', action: () => onSend('Muestra cargas urgentes') },
    { cmd: '/mejores', desc: 'Cargas mejor pagadas', action: () => onSend('Cargas con mejor precio por kilómetro') },
    { cmd: '/cerca', desc: 'Cargas cercanas', action: () => onSend('Cargas que salen desde mi ubicación') },
    { cmd: '/frigorifico', desc: 'Cargas refrigeradas', action: () => onSend('Busca cargas frigoríficas disponibles') },
    { cmd: '/resumen', desc: 'Resumen del día', action: () => onSend('Dame un resumen de las cargas disponibles hoy') },
    { cmd: '/ayuda', desc: 'Ver comandos', action: () => setShowCommands(true) },
  ];

  const suggestions = [
    { text: 'Cargas de Madrid a Barcelona', icon: <RouteIcon /> },
    { text: 'Busca cargas frigoríficas', icon: <SnowflakeIcon /> },
    { text: '¿Qué cargas hay hacia Sevilla?', icon: <MapPinIcon /> },
    { text: 'Rutas más rentables hoy', icon: <TrendingUpIcon /> },
    { text: 'Cargas urgentes disponibles', icon: <ZapIcon /> },
    { text: 'Compara rutas Madrid-Valencia vs Madrid-Barcelona', icon: <TargetIcon /> },
  ];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Show commands menu when typing /
    if (value.startsWith('/')) {
      setShowCommands(true);
    } else {
      setShowCommands(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();

      // Check if it's a command
      const cmd = commands.find(c => input.toLowerCase().startsWith(c.cmd));
      if (cmd) {
        cmd.action();
        setInput('');
        setShowCommands(false);
      } else {
        onSend();
      }
    }
    if (e.key === 'Escape') {
      setShowCommands(false);
    }
  };

  const exportChat = () => {
    const chatText = messages.map(m => `${m.role === 'user' ? 'Tú' : 'Asistente'}: ${m.content}`).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-carga-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const clearChat = () => {
    if (window.confirm('¿Borrar toda la conversación?')) {
      // This would need to be handled in parent component
      window.location.reload();
    }
  };

  const filteredMessages = searchQuery
    ? messages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  // Calculate position and size style
  const getPositionStyle = () => {
    if (chatSize === 'fullscreen') return {};

    let clampedX = position.x;
    let clampedY = position.y;

    // Ensure position stays within viewport bounds
    if (clampedX !== null && clampedY !== null) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      clampedX = Math.max(0, Math.min(viewportWidth - size.width, clampedX));
      clampedY = Math.max(0, Math.min(viewportHeight - size.height, clampedY));
    }

    const style = {
      width: `${size.width}px`,
      height: `${size.height}px`
    };

    if (clampedX !== null && clampedY !== null) {
      style.left = `${clampedX}px`;
      style.top = `${clampedY}px`;
      style.right = 'auto';
      style.bottom = 'auto';
    }

    return style;
  };

  const hasCustomPosition = position.x !== null || size.width !== 420 || size.height !== 600;

  return (
    <>
      <button
        className={`chat-fab ${open ? 'open' : ''} ${messages.length > 0 && !open ? 'has-messages' : ''}`}
        onClick={() => setOpen(!open)}
        data-testid="chat-toggle"
      >
        {open ? <XIcon /> : <MessageCircleIcon />}
        {!open && <span className="chat-fab-label">Abrir el asistente</span>}
        {!open && messages.length > 0 && <span className="chat-fab-badge">{messages.length}</span>}
      </button>

      {open && (
        <div
          ref={chatWindowRef}
          className={`chat-window enhanced ${chatSize} ${isMinimized ? 'minimized' : ''} ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''} ${hasCustomPosition ? 'custom-position' : ''} ${open ? 'open' : ''}`}
          style={getPositionStyle()}
        >
          {/* Resize handles */}
          {chatSize !== 'fullscreen' && !isMinimized && (
            <>
              <div className="resize-handle resize-n" onMouseDown={(e) => handleResizeStart(e, 'n')} onTouchStart={(e) => handleResizeStart(e, 'n')} />
              <div className="resize-handle resize-s" onMouseDown={(e) => handleResizeStart(e, 's')} onTouchStart={(e) => handleResizeStart(e, 's')} />
              <div className="resize-handle resize-e" onMouseDown={(e) => handleResizeStart(e, 'e')} onTouchStart={(e) => handleResizeStart(e, 'e')} />
              <div className="resize-handle resize-w" onMouseDown={(e) => handleResizeStart(e, 'w')} onTouchStart={(e) => handleResizeStart(e, 'w')} />
              <div className="resize-handle resize-ne" onMouseDown={(e) => handleResizeStart(e, 'ne')} onTouchStart={(e) => handleResizeStart(e, 'ne')} />
              <div className="resize-handle resize-nw" onMouseDown={(e) => handleResizeStart(e, 'nw')} onTouchStart={(e) => handleResizeStart(e, 'nw')} />
              <div className="resize-handle resize-se" onMouseDown={(e) => handleResizeStart(e, 'se')} onTouchStart={(e) => handleResizeStart(e, 'se')} />
              <div className="resize-handle resize-sw" onMouseDown={(e) => handleResizeStart(e, 'sw')} onTouchStart={(e) => handleResizeStart(e, 'sw')} />
            </>
          )}

          {/* Draggable Header */}
          <div
            ref={dragHandleRef}
            className={`chat-header ${chatSize !== 'fullscreen' ? 'draggable' : ''}`}
            onMouseDown={chatSize !== 'fullscreen' ? handleDragStart : undefined}
            onTouchStart={chatSize !== 'fullscreen' ? handleDragStart : undefined}
          >
            <div className="chat-header-info">
              <div className="chat-bot-avatar premium-bot">
                <PremiumBotIcon />
                <span className="bot-status"></span>
              </div>
              <div>
                <h4>Asistente</h4>
                <p>
                  {loading ? 'Escribiendo...' : 'Bot \u2022 En l\u00ednea'}
                </p>
              </div>
            </div>
            <div className="chat-header-actions">
              {hasCustomPosition && chatSize !== 'fullscreen' && (
                <button
                  onClick={(e) => { e.stopPropagation(); resetPosition(); }}
                  className="header-action-btn reset-btn"
                  title="Volver a tama\u00f1o original"
                >
                  <ResetIcon />
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setChatSize(chatSize === 'fullscreen' ? 'normal' : 'fullscreen'); }}
                className="header-action-btn"
                title="Pantalla completa"
              >
                <ExpandIcon />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="header-action-btn" title="Minimizar">
                <MinusIcon />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setOpen(false); }} className="chat-close">
                <XIcon />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Actions Carousel */}
              <div className="chat-quick-actions">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    className="chat-quick-btn"
                    onClick={() => onSend(action.query)}
                    style={{ '--action-color': action.color }}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Context Bar */}
              {messages.length > 0 && (
                <div className="chat-context-bar">
                  <div className="context-info">
                    <span className="context-count">{messages.length} mensajes</span>
                    <span className="context-separator">&bull;</span>
                    <span className="context-cargas">{cargas.length} cargas disponibles</span>
                  </div>
                  <div className="context-actions">
                    <button onClick={() => setShowHistory(!showHistory)} className={showHistory ? 'active' : ''} title="Buscar">
                      <SearchIcon />
                    </button>
                    <button onClick={exportChat} title="Exportar chat">
                      <DownloadIcon />
                    </button>
                    <button onClick={clearChat} title="Limpiar chat">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              )}

              {/* Search Bar */}
              {showHistory && (
                <div className="chat-search-bar">
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Buscar en la conversaci\u00f3n..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button onClick={() => { setShowHistory(false); setSearchQuery(''); }}>
                    <XIcon />
                  </button>
                </div>
              )}

              {/* Messages */}
              <div className="chat-messages">
                {filteredMessages.length === 0 && !searchQuery && (
                  <div className="chat-welcome">
                    {/* <div className="welcome-icon"><img src="/assets/img/bot-icon.svg" alt="Bot" style={{ width: 70, height: 70 }} /></div> */}
                    <h3>¡Hola! Soy tu asistente</h3>
                    <p>Puedo ayudarte a encontrar las mejores cargas. Prueba alguna de estas opciones:</p>
                    <div className="welcome-suggestions">
                      {suggestions.map((s, i) => (
                        <button key={i} className="suggestion-btn" onClick={() => onSend(s.text)}>
                          {s.icon}
                          <span>{s.text}</span>
                        </button>
                      ))}
                    </div>
                    <div className="welcome-tip">
                      <LightbulbIcon />
                      <span>Tip: Escribe <code>/</code> para ver comandos r&aacute;pidos</span>
                    </div>
                  </div>
                )}

                {searchQuery && filteredMessages.length === 0 && (
                  <div className="no-results-chat">
                    <SearchIcon />
                    <p>No se encontraron mensajes con "{searchQuery}"</p>
                  </div>
                )}

                {filteredMessages.map((msg, i) => (
                  <div key={i} className={`chat-message ${msg.role} ${msg.isError ? 'error' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="assistant-avatar">
                        <PremiumBotIconStatic />
                      </div>
                    )}
                    <div className="message-wrapper">
                      <div className="message-content">
                        {msg.content}
                      </div>
                      {msg.cargas && msg.cargas.length > 0 && (
                        <div className="chat-cargas">
                          {msg.cargas.slice(0, 4).map(carga => (
                            <div key={carga.id} className="chat-carga-card">
                              <div className="chat-carga-header">
                                <span className="chat-carga-route">{carga.origen} &rarr; {carga.destino}</span>
                                <span className={`chat-carga-tipo ${carga.tipo}`}>{carga.tipo}</span>
                              </div>
                              <div className="chat-carga-details">
                                <span><WeightIcon /> {carga.peso}t</span>
                                <span><RouteIcon /> {carga.distancia}km</span>
                                <span className="chat-carga-price"><EuroIcon /> {carga.precio}&euro;</span>
                              </div>
                              <div className="chat-carga-metrics">
                                <span className="metric">{(carga.precio / carga.distancia).toFixed(2)} &euro;/km</span>
                              </div>
                              <div className="chat-carga-actions">
                                <button className="chat-accept-btn" onClick={() => onAcceptCarga(carga.id)}>
                                  <CheckCircleIcon /> Aceptar
                                </button>
                                <button className="chat-view-btn" onClick={() => setCurrentPage('mapa')}>
                                  <MapIcon /> Ver
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {msg.role === 'assistant' && i === messages.length - 1 && !loading && (
                        <div className="message-actions">
                          <button onClick={() => onSend('Dame más opciones')}>
                            <RefreshIcon /> M&aacute;s opciones
                          </button>
                          <button onClick={() => setCurrentPage('mapa')}>
                            <MapIcon /> Ver en mapa
                          </button>
                          <button onClick={() => onSend('Compara estas cargas')}>
                            <TargetIcon /> Comparar
                          </button>
                        </div>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="user-avatar">
                        <UserIcon />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="chat-message assistant">
                    <div className="assistant-avatar"><PremiumBotIconStatic /></div>
                    <div className="message-wrapper">
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Commands Menu */}
              {showCommands && (
                <div className="commands-menu">
                  <div className="commands-header">
                    <span>Comandos r&aacute;pidos</span>
                    <button onClick={() => setShowCommands(false)}><XIcon /></button>
                  </div>
                  <div className="commands-list">
                    {commands
                      .filter(c => !input || c.cmd.includes(input.toLowerCase()))
                      .map((cmd, i) => (
                        <button
                          key={i}
                          className="command-item"
                          onClick={() => { cmd.action(); setInput(''); setShowCommands(false); }}
                        >
                          <span className="command-name">{cmd.cmd}</span>
                          <span className="command-desc">{cmd.desc}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Input Container */}
              <div className="chat-input-container">
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu mensaje o usa / para comandos..."
                    disabled={loading}
                    data-testid="chat-input"
                  />
                  <div className="input-actions">
                    <button
                      className="input-action-btn"
                      onClick={() => setShowCommands(!showCommands)}
                      title="Comandos"
                    >
                      <CommandIcon />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onSend()}
                  disabled={loading || !input.trim()}
                  data-testid="chat-send"
                  className={`send-btn ${input.trim() ? 'active' : ''}`}
                >
                  <SendIcon />
                </button>
              </div>
            </>
          )}

          {/* Minimized State */}
          {isMinimized && (
            <div className="chat-minimized-content" onClick={() => setIsMinimized(false)}>
              <span>{messages.length} mensajes &bull; Click para expandir</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default EnhancedChatWidget;
