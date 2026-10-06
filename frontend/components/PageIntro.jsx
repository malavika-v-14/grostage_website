export default function PageIntro({label, title, accent, description}) {
  return <section className="page-intro" data-nav-theme="dark"><div className="wrap"><p className="eyebrow"><span className="status-dot" />{label}</p><div className="page-intro-grid"><h1>{title}<br /><span className="serif">{accent}</span></h1>{description && <p className="lead">{description}</p>}</div></div></section>;
}
