import Reveal from './Reveal';
export default function PageIntro({label, title, accent, description}) {
  return <section className="page-intro wrap"><Reveal><p className="eyebrow"><span className="status-dot" />{label}</p><h1>{title}<br /><span className="serif">{accent}</span></h1>{description && <p className="lead">{description}</p>}</Reveal></section>;
}
