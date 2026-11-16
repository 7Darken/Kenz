/**
 * Le contact Pro (features/contact) : point d'entrée public, pour les autres modules.
 *
 * `ContactSection` : le chapitre `#contact` (« Parlons de votre idée. », GitHub et LinkedIn, le formulaire
 * nom / e-mail ou @ / besoin / message → `POST /api/contact`, type `contact`, puis l'état « Merci »).
 *   - `variant` : `pro` (accueil, défaut) ou `agents` (page /agents : « Parlons de votre process. », un autre
 *     exemple dans le message, le besoin « Des agents IA » présélectionné).
 * Composant serveur ; seul le formulaire est un composant client. L'envoi et le merci : `useContactSubmit`
 * (design-system/lib), partagé avec le formulaire Marques.
 */
export { ContactSection, type ContactSectionProps } from "./contact-section";
