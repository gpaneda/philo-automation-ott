describe('Jest Setup Test', () => {
  it('should run TypeScript tests', () => {
    expect(true).toBe(true);
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });
}); 