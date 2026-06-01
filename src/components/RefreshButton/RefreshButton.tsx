import { useQueryClient } from '@tanstack/react-query';
import './RefreshButton.css';

function RefreshButton() {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['pokemonList'] });
    queryClient.invalidateQueries({ queryKey: ['pokemonDetail'] });
  };

  return (
    <button className="refresh-button" onClick={handleRefresh}>
      🔄 Refresh
    </button>
  );
}

export default RefreshButton;