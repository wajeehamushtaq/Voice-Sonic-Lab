
import React, { useState } from 'react';
import { saveProject } from '../services/mockApiService';
import { toast } from 'sonner';
import { Spinner } from './Spinner';

interface ProjectActionsProps {
  disabled: boolean;
  onExport: () => void;
}

const SaveIcon = (): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
    </svg>
);
const ExportIcon = (): React.ReactNode => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);


export default function ProjectActions({ disabled, onExport }: ProjectActionsProps): React.ReactNode {
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    toast.info("Saving project to Supabase...");
    try {
      await saveProject({
        projectName: `Project-${Date.now()}`,
        // In a real app, you would pass the actual settings here
      });
      toast.success("Project saved successfully! (Mocked)");
    } catch (error) {
      toast.error("Failed to save project. (Mocked)");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`p-6 bg-gray-800 rounded-xl border border-gray-700 ${disabled ? 'opacity-50' : ''}`}>
       <h2 className="text-xl font-bold text-white mb-4">Finalize</h2>
       <div className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 ${disabled ? 'pointer-events-none' : ''}`}>
        <button
            onClick={handleSave}
            disabled={disabled || isSaving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
            {isSaving ? <Spinner/> : <SaveIcon/>}
            <span>{isSaving ? 'Saving...' : 'Save to Cloud'}</span>
        </button>
        <button
            onClick={onExport}
            disabled={disabled}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
            <ExportIcon/>
            <span>Export Audio</span>
        </button>
       </div>
    </div>
  );
}
