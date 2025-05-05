// Import and re-export all components
import DetallePendiente from './DetallePendiente/DetallePendienteIndex';
import PersonalInfoSection from './DetallePendiente/PersonalInfoSection ';
import AcademicInfoSection from './DetallePendiente/AcademicInfoSection ';
import InstitutionsSection from './DetallePendiente/InstitutionsSection ';
import DocumentsSection from './DetallePendiente/DocumentsSection ';
import ApprovalModal from './DetallePendiente/ApprovalModal ';
import RejectModal from './DetallePendiente/RejectModal ';
import DocumentViewerModal from './DetallePendiente/DocumentViewerModal ';

// Export individual components
export {
  DetallePendiente,
  PersonalInfoSection,
  AcademicInfoSection,
  InstitutionsSection,
  DocumentsSection,
  ApprovalModal,
  RejectModal,
  DocumentViewerModal
};

// Export default component
export default DetallePendiente;