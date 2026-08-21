import { ScanResultData, LeadInfo } from '../types';

export function useWhatsAppShare() {
  const shareScanResult = (result: ScanResultData, lead?: LeadInfo) => {
    const name = lead?.nombre ? ` de ${lead.nombre}` : '';
    const message = `🌙 *Diagnóstico Somático D.U.E.R.M.E.™ Mujer*${name}\n\n` +
      `📊 *Nivel de Disrupción:* ${result.insomniaLevel} (${result.percentage}%)\n` +
      `🧠 *Arquetipo:* ${result.archetypeTitle}\n` +
      `⏳ *Deuda de Sueño:* ~${result.sleepDebtHours} horas/noche\n` +
      `🎵 *Frecuencia Recomendada:* ${result.recommendedFrequency}\n` +
      `⚡ *Vulnerabilidad Biológica:* ${result.keyVulnerability}\n\n` +
      `✨ Descubre tu arquitectura del descanso en D.U.E.R.M.E.™ - Tu Poder Mental™ Mujer con Clara Luz: ${window.location.origin}`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const shareDayCompleted = (dayNumber: number, dayTitle: string, lead?: LeadInfo) => {
    const name = lead?.nombre ? ` (${lead.nombre})` : '';
    const message = `🌙 *¡Día ${dayNumber} Completado en D.U.E.R.M.E.™ Mujer!*${name}\n\n` +
      `✨ *Tema:* ${dayTitle}\n` +
      `🧘 *Estado:* Asimilación Circadiana de 24 horas activada con la mentora Clara Luz.\n` +
      `Recuperando mi sueño para recuperar mi energía y mi paz.\n\n` +
      `Conoce el método en: ${window.location.origin}`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const shareAppInvite = () => {
    const message = `🌙 Te recomiendo *D.U.E.R.M.E.™ Mujer* (Descanso Mental y Recuperación), una app extraordinaria de *Tu Poder Mental™ Mujer* con la mentora Clara Luz.\n\n` +
      `Incluye test somático inteligente, frecuencias binaurales Delta/Theta nativas, respiración 4-7-8 y protocolo de 7 días.\n\n` +
      `Pruébala gratis aquí: ${window.location.origin}`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return {
    shareScanResult,
    shareDayCompleted,
    shareAppInvite,
  };
}
