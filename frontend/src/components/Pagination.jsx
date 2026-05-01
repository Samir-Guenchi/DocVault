import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Pagination({ page, pageSize, totalItems, onPageChange }) {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (page >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', page - 1, page, page + 1, '...', totalPages];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-container">
      <button 
        className="btn btn-outline-primary btn-sm" 
        disabled={page === 1} 
        onClick={() => onPageChange(page - 1)}
        title="Go to previous page"
      >
        <ChevronLeft className="icon-sm" />
        {t('pagination.previous')}
      </button>

      <div className="pagination-info">
        {t('pagination.showing')} <strong>{startItem}</strong> {t('pagination.to')} <strong>{endItem}</strong> {t('pagination.of')} <strong>{totalItems}</strong>
      </div>

      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
        {pageNumbers.map((number, index) => {
          if (number === '...') {
            return (
              <span key={`ellipsis-${index}`} style={{ padding: '0.5rem 0.75rem', color: '#737373' }}>
                ...
              </span>
            );
          }

          return (
            <button
              key={number}
              className={`btn btn-sm ${page === number ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => onPageChange(number)}
              title={`Go to page ${number}`}
            >
              {number}
            </button>
          );
        })}
      </div>

      <button 
        className="btn btn-outline-primary btn-sm" 
        disabled={page === totalPages} 
        onClick={() => onPageChange(page + 1)}
        title="Go to next page"
      >
        {t('pagination.next')}
        <ChevronRight className="icon-sm" />
      </button>
    </div>
  );
}
