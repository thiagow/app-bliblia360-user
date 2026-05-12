"use client"

import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import type { ToolbarProps, ToolbarSlot } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export function PdfViewer({ slug }: { slug: string }) {
  const renderToolbar = (Toolbar: (props: ToolbarProps) => React.ReactElement) => (
    <Toolbar>
      {(slots: ToolbarSlot) => {
        const {
          CurrentPageInput,
          EnterFullScreen,
          GoToNextPage,
          GoToPreviousPage,
          NumberOfPages,
          Print,
          ShowSearchPopover,
          Zoom,
          ZoomIn,
          ZoomOut,
        } = slots;
        return (
          <div className="flex items-center w-full px-2">
            <div className="p-1">
              <ShowSearchPopover />
            </div>
            <div className="p-1 hidden md:block">
              <ZoomOut />
            </div>
            <div className="p-1 hidden md:block">
              <Zoom />
            </div>
            <div className="p-1 hidden md:block">
              <ZoomIn />
            </div>
            <div className="p-1 ml-auto">
              <GoToPreviousPage />
            </div>
            <div className="p-1 flex items-center text-sm md:text-base">
              <div className="w-12 md:w-16"><CurrentPageInput /></div>
              <span className="mx-1 md:mx-2">/</span> <NumberOfPages />
            </div>
            <div className="p-1">
              <GoToNextPage />
            </div>
            <div className="p-1 ml-auto">
              <EnterFullScreen />
            </div>
            <div className="p-1">
              <Print />
            </div>
          </div>
        );
      }}
    </Toolbar>
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar,
    sidebarTabs: () => [], // Retorna array vazio para remover a sidebar (Thumbnail, Bookmark, Attachment)
  });
  
  // Use pdfjs-dist worker
  const workerUrl = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

  return (
    <div className="h-[80vh] w-full border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900">
      <Worker workerUrl={workerUrl}>
        <Viewer
          fileUrl={`/api/pdf/${slug}`}
          plugins={[defaultLayoutPluginInstance]}
          theme="dark"
        />
      </Worker>
    </div>
  )
}
