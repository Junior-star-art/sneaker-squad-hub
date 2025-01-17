import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ColorSearchProps {
  onColorSelect: (colors: string[]) => void;
}

const PRESET_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Green', hex: '#00FF00' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Orange', hex: '#FFA500' },
];

const ColorSearch = ({ onColorSelect }: ColorSearchProps) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState('#000000');

  const handleColorSelect = (color: string) => {
    if (!selectedColors.includes(color)) {
      const newColors = [...selectedColors, color];
      setSelectedColors(newColors);
      onColorSelect(newColors);
      navigator.vibrate(50); // Haptic feedback
    }
  };

  const handleColorRemove = (color: string) => {
    const newColors = selectedColors.filter(c => c !== color);
    setSelectedColors(newColors);
    onColorSelect(newColors);
    navigator.vibrate(50); // Haptic feedback
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <Button
            key={color.hex}
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleColorSelect(color.hex)}
          >
            <div
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: color.hex }}
            />
            {color.name}
          </Button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <HexColorPicker color={currentColor} onChange={setCurrentColor} />
        <Button
          onClick={() => handleColorSelect(currentColor)}
          className="w-full"
        >
          Add Custom Color
        </Button>
      </div>

      {selectedColors.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedColors.map((color, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              {color}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => handleColorRemove(color)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorSearch;