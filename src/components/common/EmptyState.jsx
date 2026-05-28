/**
 * EmptyState — Reusable premium empty state component.
 *
 * Props:
 *  - icon:        React icon component to render (required)
 *  - title:       Primary heading (required)
 *  - description: Supportive body text (optional)
 *  - action:      { label, onClick } — optional CTA button
 *  - compact:     boolean — use a smaller layout (e.g. inside a chart card)
 */
const EmptyState = ({ icon: Icon, title, description, action, compact = false }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: compact ? '2rem 1.5rem' : '3.5rem 2rem',
        gap: compact ? '0.85rem' : '1.25rem',
        width: '100%',
        minHeight: compact ? '180px' : '280px',
      }}
    >
      {/* Icon bubble */}
      <div
        style={{
          width: compact ? '52px' : '64px',
          height: compact ? '52px' : '64px',
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: compact ? '1.35rem' : '1.75rem',
          color: 'rgba(139, 92, 246, 0.7)',
          flexShrink: 0,
          boxShadow: '0 0 24px rgba(139, 92, 246, 0.08)',
        }}
      >
        <Icon />
      </div>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <p
          style={{
            color: 'var(--text-main)',
            fontWeight: 600,
            fontSize: compact ? '0.95rem' : '1.1rem',
            margin: 0,
          }}
        >
          {title}
        </p>
        {description && (
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: compact ? '0.8rem' : '0.9rem',
              margin: 0,
              maxWidth: '280px',
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* CTA Button */}
      {action && (
        <button
          onClick={action.onClick}
          style={{
            marginTop: '0.25rem',
            padding: '0.65rem 1.5rem',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            color: 'var(--text-main)',
            fontWeight: 600,
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(139, 92, 246, 0.3)';
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
