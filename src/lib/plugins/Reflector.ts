/**
 * The Reflector class
 */
class Reflector {
  /** The reflector wiring */
  protected wiring: string;
  /** The alphabet */
  private readonly alphabet: string = "abcdefghijklmnopqrstuvwxyz";

  /**
   *
   * @param {string} wiring The reflector wiring
   */
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

//exporting all the possible reflectors
const ReflectorA = new Reflector("ejmzalyxvbwfcrquontspikhgd");
const ReflectorB = new Reflector("yruhqsldpxngokmiebfzcwvjat");
const ReflectorC = new Reflector("fvpjiaoyedrzxwgctkuqsbnmhl");

export default {
  Reflectors: [ReflectorA, ReflectorB, ReflectorC],
};
