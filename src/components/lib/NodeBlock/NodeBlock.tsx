import React, { ReactElement, ReactNode, useState } from 'react';

import { CopyIcon } from '../../../../src/components/icons/CopyIcon';
import { OkIcon } from '../../../../src/components/icons/OkIcon';
import { isHex } from '../../../../src/lib/decodeHex';
import {
  Bytes32StringToggle,
  HexDecToggle,
  ToggleWithSideEffectProps,
} from '../Toggle';

export function NodeBlock({
  children,
  className,
  str,
  nodeType,
  toggle = true,
}: NodeBlockProps): ReactElement {
  const [copyNotification, setCopyNotification] = useState(false);

  const [state, setState] = useState<{ isState: boolean; inner: string }>({
    // it's going to be changed right away, set false naively to avoid type problems
    isState: false,
    inner: str,
  });

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-12 cursor-pointer
        items-center gap-3 overflow-auto whitespace-nowrap rounded-md
        pr-4 font-mono text-sm duration-200 ${className}`}
      >
        {toggle && (
          <AdequateToggle str={str} state={state} setState={setState} />
        )}
        {children}
        <code id="node-type" className="text-purple">
          {nodeType}
        </code>
        <div
          onClick={async (event) => {
            const value =
              event.currentTarget.children.namedItem('node-value')?.textContent;
            if (value) {
              void window.navigator.clipboard.writeText(value);
              setCopyNotification(true);
              setTimeout(() => {
                setCopyNotification(false);
              }, 1500);
            }
          }}
          className="flex h-10 items-center gap-3 rounded-md border 
          border-gray-600 bg-gray-700 p-1 px-2 shadow-md shadow-gray-800 
          duration-200 hover:bg-gray-800 active:bg-gray-800"
        >
          <code
            className="whitespace-nowrap"
            aria-label="decoded value"
            id="node-value"
          >
            {state.inner}
          </code>
          {!copyNotification ? (
            <CopyIcon className="cursor-pointer" />
          ) : (
            <OkIcon className="delay-300" />
          )}
        </div>
      </div>
    </div>
  );
}

// @internal
export interface NodeBlockProps {
  /*
   * Value to display inside the node block
   */
  str: string;
  /*
   * Any children to display inside the node block
   */
  children?: ReactNode;
  className?: string;
  /*
   * Because the node block is usually used to display Solidity types, we often want to
   * display the type of the node. e.g "uint256" or "string"
   */
  nodeType?: string;
  /*
   * Should the toggle be displayed (default: true)
   */
  toggle?: boolean;
}

// @internal
type AdequateToggle = Omit<
  ToggleWithSideEffectProps<string, string>,
  'isDisabled' | 'isStateFn'
> & {
  str: string;
};

// @internal

function AdequateToggle({
  str,
  state,
  setState,
}: AdequateToggle): ReactElement {
  const isString = isNaN(Number.parseInt(str));

  return isString ? (
    <Bytes32StringToggle
      isStateFn={isHex}
      isDisabled={false}
      state={state}
      setState={setState}
    />
  ) : (
    <HexDecToggle
      isStateFn={isHex}
      isDisabled={false}
      state={state}
      setState={setState}
    />
  );
}
