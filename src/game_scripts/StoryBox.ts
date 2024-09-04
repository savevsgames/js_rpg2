import { StoryBoxConfig } from "./interfaces/StoryBoxConfig";

export default class StoryBox {
  private scene: Phaser.Scene;
  private config: StoryBoxConfig;
  private element: Phaser.GameObjects.DOMElement | null;
  private currentTextIndex: number;
  private isRevealing: boolean;
  private accumulatedText: string;
  private characterLimit: number;

  constructor(scene: Phaser.Scene, config: StoryBoxConfig) {
    this.scene = scene;
    this.currentTextIndex = 0;
    this.isRevealing = false;
    this.element = null;
    this.accumulatedText = "WELCOME TO SHADOWTIDE ISLAND.... almost!";
    this.characterLimit = 300; // Adjust this value to set the character limit per page

    const defaultStyle = {
      fontSize: "48px",
      backgroundColor: "rgb(209, 172, 104)",
      textColor: "rgb(24, 20, 12)",
      padding: "2rem",
      borderRadius: "1rem",
      fontFamily: "Garamond, serif",
      transition: "all 1s ease-in-out",
      border: "1rem solid rgba(24, 20, 12, 0.5)",
      fontWeight: "bold",
      marginBottom: "2rem", // Add space at the bottom
      height: "200px", // Set fixed height
      overflow: "hidden", // Hide overflow text
    };

    // Merge the passed config with the default style
    this.config = {
      ...config,
      style: {
        ...defaultStyle,
        ...(config.style || {}),
      },
      revealSpeed: config.revealSpeed || 30,
    };
  }

  onComplete?: (() => void) | undefined;

  create() {
    const { width, height } = this.scene.cameras.main;

    const style = `
      background-color: ${this.config.style?.backgroundColor}; 
      color: ${this.config.style?.textColor}; 
      padding: ${this.config.style?.padding}; 
      border-radius: ${this.config.style?.borderRadius}; 
      font: ${this.config.style?.fontWeight} ${this.config.style?.fontSize} ${this.config.style?.fontFamily}; 
      border: ${this.config.style?.border}; 
      transition: ${this.config.style?.transition};
      width: 80%; 
      height: ${this.config.style?.height}; 
      overflow: ${this.config.style?.overflow};
    `;

    this.element = this.scene.add.dom(
      width / 2,
      height - 150,
      "div",
      style,
      this.accumulatedText
    );

    // Set the text to be centered and stay with the camera
    this.element.setScrollFactor(0);

    this.element.addListener("click");
    this.element.on("click", () => this.nextText());

    if (this.scene.input.keyboard) {
      this.scene.input.keyboard.on("keydown-ENTER", () => this.nextText());
    }

    this.scene.events.emit("storyBoxTextStart", this.currentTextIndex);
  }

  nextText() {
    if (this.isRevealing) {
      this.revealFullText();
    } else {
      if (this.currentTextIndex < this.config.texts.length) {
        // Get the next chunk of text to display
        const nextChunk = this.getNextTextChunk(
          this.config.texts[this.currentTextIndex]
        );
        this.clearContent(); // Clear previous accumulated text before displaying new text
        this.accumulatedText = nextChunk; // Update accumulated text with the new chunk
        this.revealText(this.accumulatedText);

        // Move to the next text index only if all text has been displayed
        if (nextChunk.length < this.characterLimit) {
          this.currentTextIndex++;
        }
      } else {
        this.destroy();
        if (this.config.onComplete) this.config.onComplete();
        this.scene.events.emit("storyBoxComplete");
      }
    }
  }

  getNextTextChunk(text: string): string {
    if (text.length <= this.characterLimit) {
      return text;
    } else {
      const chunkEnd = this.findSuitableBreakPoint(text, this.characterLimit);
      const chunk = text.slice(0, chunkEnd);
      const remainder = text.slice(chunkEnd).trim();
      this.config.texts[this.currentTextIndex] = `...${remainder}`; // Update the remaining text for the next page
      return `${chunk}...`;
    }
  }

  findSuitableBreakPoint(text: string, limit: number): number {
    const punctuation = [".", "!", "?", ",", " "];
    let breakPoint = text.lastIndexOf(" ", limit); // Find the last space within the limit

    // If no space is found, use the full limit
    if (breakPoint === -1) breakPoint = limit;

    // Check if the break point falls on punctuation and adjust accordingly
    for (const mark of punctuation) {
      const index = text.lastIndexOf(mark, limit);
      if (index > breakPoint) breakPoint = index;
    }

    return breakPoint + 1; // Include the punctuation or space in the chunk
  }

  revealText(text: string) {
    if (this.element) {
      this.isRevealing = true;
      let revealedText = "";
      const interval = setInterval(() => {
        if (revealedText.length < text.length) {
          revealedText += text[revealedText.length];
          this.element?.setHTML(revealedText);
        } else {
          clearInterval(interval);
          this.isRevealing = false;
          this.scene.events.emit("storyBoxTextComplete", this.currentTextIndex);
        }
      }, this.config.revealSpeed);
    }
  }

  revealFullText() {
    if (this.element) {
      this.element.setHTML(this.accumulatedText);
      this.isRevealing = false;
      this.scene.events.emit("storyBoxTextComplete", this.currentTextIndex);
    }
  }

  clearContent() {
    if (this.element) {
      this.element.setHTML(""); // Clear the content of the DOM element
    }
  }

  destroy() {
    if (this.element) {
      this.element.removeListener("click");
      this.element.destroy();
    }
    if (this.scene.input.keyboard) {
      this.scene.input.keyboard.off("keydown-ENTER");
    }
  }

  update() {
    if (this.element) {
      const { width, height } = this.scene.cameras.main;
      this.element.x = width / 2;
      this.element.y = height - 150;
    }
  }
}
