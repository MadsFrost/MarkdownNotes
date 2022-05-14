import React, { useState, useRef, useEffect } from "react";
import mermaid from "mermaid";
export const Code = ({ inline, children = [], className, ...props }: any) => {
  const demoid = useRef(`dome${randomid()}`);
  const code = getCode(children);
  const demo = useRef(null);
  useEffect(() => {
    if (demo.current) {
      try {
        const str = mermaid.render(demoid.current, code, (): any => null, demo.current);
        // @ts-ignore
        demo.current.innerHTML = str;
      } catch (error) {
        // @ts-ignore
        demo.current.innerHTML = error;
      }
    }
  }, [code, demo]);

  if (
    typeof code === "string" && typeof className === "string" &&
    /^language-mermaid/.test(className.toLocaleLowerCase())
  ) {
    return (
      <code ref={demo}>
        <code id={demoid.current} style={{ display: "none" }} />
      </code>
    );
  }
  return <code className={String(className)}>{children}</code>;
};

export const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);

export const getCode = (arr: any = []) => arr.map((dt: any) => {
  if (typeof dt === "string") {
    return dt;
  }
  if (dt.props && dt.props.children) {
    return getCode(dt.props.children);
  }
  return false;
}).filter(Boolean).join("");