export class Plugboard {
  /** The plugboard connections */
  connections: string[];

  /**
   *
   * @param {string[]} connections The plugboard connections
   */
  constructor(connections: string[]) {
    this.connections = connections;
  }

  /**
   * The function that swaps the letters according to the plugboard connection
   *
   * @param {string} currentKey The key the user pressed
   * @returns {string} The key after the plugboard switch
   */
  public swap(currentKey: string): string {
    this.connections.forEach((connection) => {
        //the index of the current key in a plugboard connection
      let swapKeyIndex = connection.indexOf(currentKey);

      //swapping the keys if they match with a connection
      switch(swapKeyIndex) {
        case 0:
            currentKey = connection[1];
            break;
        case 1:
            currentKey = connection[0];
            break;
      }
    });

    return currentKey;
  }
}
