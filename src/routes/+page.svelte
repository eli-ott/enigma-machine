<script lang="ts">
  import { onMount } from "svelte";
  import { Plugboard } from "$lib/plugins/Plugboard";

  /** The plugboard*/
  let plugboard = new Plugboard(["az", "eb", "kl", "sd", "uj", "ym", "fn", "ro", "vh", "wt", "gs"]);

  /** The alphabet */
  let alphabet: string = "abcdefghijklmnopqrstuvwxyz";
  /** The key pressed by the user */
  let currentKey: string = "";
  /** The user input's history */
  let pressedKeyHistory: string[] = [];
  /** The user ciphered keys */
  let cipheredKeyHistory: string[] = [];

  /**
   * On mount
   */
  onMount(() => {
    initKeyPress();
  });

  /**
   * Initializing the key press event
   */
  const initKeyPress = () => {
    window.addEventListener("keydown", (event) => {
      //only allowing one key press at a time
      if (event.repeat) return;

      let pressedKey = event.key.toLowerCase();

      //changing the pressed key only if it is in the alphabet
      if (alphabet.includes(pressedKey)) {
        //keeping track of the current key and all the key pressed previously
        currentKey = pressedKey;
        pressedKeyHistory = [...pressedKeyHistory, currentKey];

        //adding the ciphered key to an array
        cipheredKeyHistory = [
          ...cipheredKeyHistory,
          plugboard.swap(currentKey),
        ];
      }
    });
  };
</script>

<p>
  Press any key : {currentKey} <br />
  Your pressed keys : {pressedKeyHistory.join("")} <br />
  Your ciphered keys : {cipheredKeyHistory.join("")}
</p>
