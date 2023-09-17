const fs = require("fs");
const path = require("path");
const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option("file", {
      description: "Path to the JSON configuration file",
      type: String,
      // default: "./generator-config.json"
    });

    this.option("generateDocusaurus", {
      description: "Generate Docusaurus documentation",
      type: Boolean,
      default: true,
    });
  }
  initializing() {
    const filePath = this.options.file;
    const configPath = path.resolve(this.contextRoot, filePath);

    if (fs.existsSync(configPath)) {
      this.configData = JSON.parse(fs.readFileSync(configPath, "utf8"));
    } else {
      this.log(`Warning: Configuration file not found at ${configPath}`);
      this.configData = {};
    }
  }

  writing() {
    const applicationName =
      this.configData.applicationName || "MyDocumentation";
    const serverPort = this.configData.serverPort || "3010";
    const theme = this.configData.theme || "default";
    const copyOpts = {
      globOptions: {
        ignore: [],
      },
    };

    const options = {
      applicationName: applicationName,
      serverPort: serverPort,
      theme: theme,
    };

    if (this.options.generateDocusaurus) {
      this._generateDocusaurus(options, copyOpts);
    }

    this._generateOtherFiles(options, copyOpts);
  }

  _generateDocusaurus(options, copyOpts) {
    this.fs.copyTpl(
      this.templatePath(`docusaurus`),
      this.destinationPath(`docusaurus-${options.applicationName}`),
      options,
      copyOpts
    );

    const templateConfigPath = this.templatePath(
      "docusaurus/docusaurus.config.js"
    );
    const templateConfigContent = this.fs.read(templateConfigPath);

    const updatedConfigContent = templateConfigContent
      .replace(/<%= applicationName %>/g, options.applicationName)
      .replace(/<%= serverPort %>/g, options.serverPort)
      .replace(/<%= theme %>/g, options.theme);

    // Write the updated config to the generated directory
    const generatedConfigPath = this.destinationPath(
      `docusaurus-${options.applicationName}/docusaurus.config.js`
    );

    this.fs.write(generatedConfigPath, updatedConfigContent);
  }

  _generateOtherFiles(options, copyOpts) {
    // Generate other files logic
    const filesToGenerate = [
      "docs/intro.md",
      "docs/Documentation/concept.md",
      "docs/Documentation/maintopic.md",
      "docs/Documentation/subfolder/subfile.md",
      "blog/2021-08-01-mdx-blog-post.mdx",
      "blog/2023-08-29-three-blog-post.md",
      "blog/2023-08-29-four-blog-post.md",
      "blog/2023-08-29-six-blog-post.md",
      "blog/2023-08-29-seven-blog-post.md",
      "blog/2023-08-29-eight-blog-post.md",
      "blog/authors.yml",
      "src/components/HomepageFeatures/index.js",
      "src/components/HomepageFeatures/styles.module.css",
      "src/css/custom.css",
      "src/pages/index.js",
      "src/pages/index.module.css",
      "src/theme/BlogListPage/Author/index.js",
      "src/theme/BlogListPage/Author/styles.module.css",
      "src/theme/BlogListPage/ListItem/index.js",
      "src/theme/BlogListPage/ListItem/styles.module.css",
      "src/theme/BlogListPage/index.js",
      "src/theme/BlogListPage/styles.module.css",
      "static/img/image.jpeg",
      "static/img/logo.png",
      "docusaurus.config.js",
      "sidebars.js",
      "package.json",
      "README.md",
    ];

    const conditionalTemplates = [
      {
        condition: this.theme === "profile",
        src: `docusaurus/srs/components/About.js`,
      },
      {
        condition: this.theme === "profile",
        src: `docusaurus/srs/components/Bio.js`,
      },
      {
        condition: this.theme === "profile",
        src: `docusaurus/srs/components/Contact.js`,
      },
      {
        condition: this.theme === "profile",
        src: `docusaurus/srs/components/Navbar.js`,
      },
    ];

    filesToGenerate.forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(`docusaurus/${file}`), // Add a forward slash here
        this.destinationPath(`docusaurus-${options.applicationName}/${file}`),
        options,
        copyOpts
      );
    });

    conditionalTemplates.forEach(({ condition, src }) => {
      if (condition) {
        this.fs.copyTpl(
          this.templatePath(`docusaurus/${src}`), // Add a forward slash here
          this.destinationPath(`docusaurus-${options.applicationName}/${src}`),
          options,
          copyOpts
        );
      }
    });
  }

  // Other helper methods, prompts, and install logic
};
