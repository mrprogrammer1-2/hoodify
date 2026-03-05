import {
  fontFamilyOptions,
  fontSizeOptions,
  fontWeightOptions,
} from "@/constants";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const selectConfigs = [
  {
    property: "fontFamily",
    placeholder: "Choose a font",
    options: fontFamilyOptions,
  },
  { property: "fontSize", placeholder: "30", options: fontSizeOptions },
  {
    property: "fontWeight",
    placeholder: "Semibold",
    options: fontWeightOptions,
  },
];

type TextProps = {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  handleInputChange: (property: string, value: string) => void;
};

const Text = ({
  fontFamily,
  fontSize,
  fontWeight,
  handleInputChange,
}: TextProps) => (
  <div className="flex flex-col gap-3 border-b border-gray-600 px-5 py-3">
    <h3 className="text-[10px] uppercase">Text</h3>

    <div className="flex flex-col gap-3">
      <RenderSelect
        key={selectConfigs[0].property}
        config={selectConfigs[0]}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fontFamily={fontFamily}
        handleInputChange={handleInputChange}
      />

      <div className="flex gap-2">
        {selectConfigs.slice(1).map((config) => (
          <RenderSelect
            key={config.property}
            config={config}
            fontSize={fontSize}
            fontWeight={fontWeight}
            fontFamily={fontFamily}
            handleInputChange={handleInputChange}
          />
        ))}
      </div>
    </div>
  </div>
);

type Props = {
  config: {
    property: string;
    placeholder: string;
    options: { label: string; value: string }[];
  };
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  handleInputChange: (property: string, value: string) => void;
};

const RenderSelect = ({
  config,
  fontSize,
  fontWeight,
  fontFamily,
  handleInputChange,
}: Props) => (
  <div className="flex flex-col w-full">
    <Label className="text-[10px] uppercase mb-1">
      {config.property === "fontFamily"
        ? "Font"
        : config.property === "fontSize"
          ? "Size"
          : "Weight"}
    </Label>
    <Select
      key={config.property}
      onValueChange={(value) => handleInputChange(config.property, value)}
      value={
        config.property === "fontFamily"
          ? fontFamily
          : config.property === "fontSize"
            ? fontSize
            : fontWeight
      }
    >
      <SelectTrigger className="no-ring w-full rounded-sm border border-border">
        <SelectValue
          placeholder={
            config.property === "fontFamily"
              ? "Choose a font"
              : config.property === "fontSize"
                ? "30"
                : "Semibold"
          }
        />
      </SelectTrigger>
      <SelectContent className="border-border bg-card text-foreground">
        {config.options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="hover:bg-primary/10 hover:text-foreground"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default Text;
