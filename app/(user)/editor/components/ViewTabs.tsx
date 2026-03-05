import { Button } from "@/components/ui/button";

type Props = {
  currentView: View;
  handleViewSwitch: (view: View) => void;
};

export default function ViewTabs({ currentView, handleViewSwitch }: Props) {
  const views: View[] = ["front", "back", "left-sleeve", "right-sleeve"];

  return (
    <div className="flex gap-4 p-4 border-b">
      {views.map((view) => (
        <Button
          key={view}
          onClick={() => handleViewSwitch(view)}
          className={`${currentView === view ? "font-bold bg-sky-600" : "bg-gray-800"} cursor-pointer ${currentView === view ? "hover:bg-sky-600" : "hover:bg-gray-700"}text-amber-50 dark:text-amber-50`}
        >
          {view}
        </Button>
      ))}
    </div>
  );
}
