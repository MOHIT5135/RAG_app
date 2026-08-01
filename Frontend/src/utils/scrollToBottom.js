const scrollToBottom = (containerRef, behavior = "smooth") => {
  if (!containerRef?.current) return;

  containerRef.current.scrollTo({
    top: containerRef.current.scrollHeight,
    behavior,
  });
};

export default scrollToBottom;