class Reflector {
  wiring: string;
  private readonly alphabet: string = 'abcdefghijklmnopqrstuvwxyz'

  constructor(wiring: string) {
    this.wiring = wiring;
  }

  /**
   * Reflect the input letters according to the reflector
   * In the wiring the letters are swapped according to the wiring
   * 
   * @param {string} letter The letter to reflect
   * @returns {string} The ciphered letter 
   */
  public reflect(letter: string): string {
    //getting the index in the wiring of the letter input 
    let indexInAlphabet = this.wiring.indexOf(letter);

    //returning the letter that corresponds to the indexInAlphabet in the alphabet
    return this.alphabet[indexInAlphabet];
  }
}

let ReflectorA = new Reflector("ejmzalyxvbwfcrquontspikhgd");
let ReflectorB = new Reflector("yruhqsldpxngokmiebfzcwvjat");
let ReflectorC = new Reflector("fvpjiaoyedrzxwgctkuqsbnmhl");

export { ReflectorA, ReflectorB, ReflectorC };
