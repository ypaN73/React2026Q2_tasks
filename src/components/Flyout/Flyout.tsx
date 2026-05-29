import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import './Flyout.css';

function Flyout() {
  const selectedItems = useSelectedItemsStore((state) => state.selectedItems);
  const unselectAll = useSelectedItemsStore((state) => state.unselectAll);

  const selectedCount = selectedItems.length;

  if (selectedCount === 0) {
    return null;
  }

  const handleDownload = () => {
    const csvHeader = 'Name,Description,Details URL';
    const csvRows = selectedItems.map(
      (item) => `"${item.name}","${item.description}","${window.location.origin}/${item.name}"`
    );
    const csvContent = [csvHeader, ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedCount}_items.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flyout">
      <span className="flyout-count">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </span>
      <div className="flyout-actions">
        <button className="flyout-button" onClick={unselectAll}>
          Unselect all
        </button>
        <button className="flyout-button flyout-button--primary" onClick={handleDownload}>
          Download
        </button>
      </div>
    </div>
  );
}

export default Flyout;