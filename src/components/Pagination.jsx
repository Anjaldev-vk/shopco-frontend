import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    hasNext, 
    hasPrevious 
}) => {
    // Only return null if there are no pages to navigate to
    if ((!totalPages || totalPages <= 1) && !hasNext && !hasPrevious) return null;

    // Generate page numbers to display
    const getPageNumbers = () => {
        if (!totalPages || totalPages <= 1) return [];
        
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first, last, and pages around current
            if (currentPage <= 3) {
                for (let i = 1; i <= 3; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-4 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPrevious}
                className={`p-2 rounded-full border transition-all duration-200 ${
                    !hasPrevious
                        ? 'text-gray-300 border-gray-200 cursor-not-allowed bg-gray-50'
                        : 'text-gray-700 border-gray-300 hover:bg-black hover:text-white hover:border-black shadow-sm'
                }`}
                aria-label="Previous page"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex items-center space-x-1">
                {totalPages > 1 ? (
                    getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-gray-400">...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page)}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                        currentPage === page
                                            ? 'bg-black text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <span className="text-sm font-medium text-gray-600 px-2">
                        Page {currentPage}
                    </span>
                )}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNext}
                className={`p-2 rounded-full border transition-all duration-200 ${
                    !hasNext
                        ? 'text-gray-300 border-gray-200 cursor-not-allowed bg-gray-50'
                        : 'text-gray-700 border-gray-300 hover:bg-black hover:text-white hover:border-black shadow-sm'
                }`}
                aria-label="Next page"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default Pagination;
