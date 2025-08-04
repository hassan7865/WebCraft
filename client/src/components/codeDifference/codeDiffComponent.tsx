import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ReactDiffViewer from "react-diff-viewer";

interface DiffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  oldCode: string;
  newCode: string;
  title?: string;
}

const DiffDialog: React.FC<DiffDialogProps> = ({
  isOpen,
  onClose,
  oldCode,
  newCode,
  title = "Code Diff",
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto p-4">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center">
                      <svg
                        className="mr-3 h-5 w-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {title}
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Diff Content */}
                <div className="bg-white">
                  <div className="overflow-hidden">
                    {React.createElement(ReactDiffViewer as any, {
                      oldValue: oldCode,
                      newValue: newCode,
                      splitView: true,
                      hideLineNumbers: false,
                      useDarkTheme: false,
                      leftTitle: "Original",
                      rightTitle: "Modified",
                      showDiffOnly: false,
                      styles: {
                        variables: {
                          light: {
                            diffViewerBackground: '#ffffff',
                            diffViewerColor: '#24292e',
                            addedBackground: '#e6ffed',
                            addedColor: '#24292e',
                            removedBackground: '#ffeef0',
                            removedColor: '#24292e',
                            wordAddedBackground: '#acf2bd',
                            wordRemovedBackground: '#fdb8c0',
                            addedGutterBackground: '#cdffd8',
                            removedGutterBackground: '#fdbdbe',
                            gutterBackground: '#f6f8fa',
                            gutterBackgroundDark: '#f6f8fa',
                            highlightBackground: '#fff5b4',
                            highlightGutterBackground: '#fff5b4',
                            codeFoldGutterBackground: '#dbedff',
                            codeFoldBackground: '#f1f8ff',
                            emptyLineBackground: '#fafbfc',
                          },
                        },
                        diffContainer: {
                          maxHeight: '70vh',
                          overflow: 'auto',
                          fontSize: '13px',
                          fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
                        },
                        splitView: {
                          display: 'flex',
                          flexDirection: 'row',
                          height: '100%',
                        },
                        titleBlock: {
                          background: '#f6f8fa',
                          padding: '10px 15px',
                          fontWeight: '600',
                          borderBottom: '1px solid #e1e4e8',
                          fontSize: '14px',
                          color: '#586069',
                        },
                        line: {
                          padding: '0 10px',
                          '&:hover': {
                            background: '#f6f8fa !important',
                          },
                        },
                        gutter: {
                          padding: '0 8px',
                          minWidth: '50px',
                          textAlign: 'right',
                          userSelect: 'none',
                          color: '#656d76',
                          fontSize: '12px',
                          lineHeight: '20px',
                          background: '#f6f8fa',
                          borderRight: '1px solid #e1e4e8',
                        },
                        marker: {
                          width: '20px',
                          padding: '0 4px',
                          textAlign: 'center',
                          fontSize: '12px',
                          lineHeight: '20px',
                          fontWeight: 'bold',
                          userSelect: 'none',
                        },
                        content: {
                          padding: '0 10px',
                          fontSize: '12px',
                          lineHeight: '20px',
                          whiteSpace: 'pre',
                          wordBreak: 'normal',
                          overflow: 'auto',
                        },
                        contentText: {
                          color: '#24292e',
                        },
                      },
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600 flex items-center">
                      <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Compare changes side by side
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DiffDialog;