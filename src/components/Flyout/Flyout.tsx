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
    alert(`Downloading ${selectedCount} items...`);
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