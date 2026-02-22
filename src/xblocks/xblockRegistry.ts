/**
 * Registry to track which xblock types have specific component handlers
 * This prevents the IframeXblock from rendering for types that already have custom components
 */

class XblockTypeRegistry {
  private handledTypes = new Set<string>();

  /**
   * Register an xblock type as being handled by a specific component
   */
  registerType(xblockType: string): void {
    this.handledTypes.add(xblockType);
  }

  /**
   * Register multiple xblock types at once
   */
  registerTypes(xblockTypes: string[]): void {
    xblockTypes.forEach(type => this.handledTypes.add(type));
  }

  /**
   * Check if an xblock type is already handled by a specific component
   */
  isTypeHandled(xblockType: string): boolean {
    return this.handledTypes.has(xblockType);
  }

  /**
   * Get all registered types
   */
  getHandledTypes(): string[] {
    return Array.from(this.handledTypes);
  }

  /**
   * Clear all registered types (useful for testing)
   */
  clear(): void {
    this.handledTypes.clear();
  }
}

// Export singleton instance
export const xblockRegistry = new XblockTypeRegistry();