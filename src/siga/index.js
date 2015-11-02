import horarioAsignaturas from './insc_procesos'

export default {
  detectActivity: function() {
    const url = window.location.href;
    if(url.match(/.+insc_procesos\.jsp/)) {
      return horarioAsignaturas
    } else if (url.match(/.+sistemas\.jsp/)) {
      return {name: 'Menú Principal'}
    }
    return {name: 'Actividad Desconocida', url: url}
  }
}
