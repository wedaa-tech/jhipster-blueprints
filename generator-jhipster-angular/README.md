# Description for Angular

 This is the blueprint for Angular sub-generator

# How to use ? 
- Change the reference of the jhipster in the package.json 

- Open package.json under dependencies replace the reference
   of the jhipster if you are working in local environment.

- For example:- 
  `````
    "generator-jhipster": "file:/home/rakesh/TIC/generator-jhipster",
  ``````
    
- Run npm install (for the first time).
- Run npm link generator-jhipster-angular.

# Getting started 

- Use example.jdl file to generate the angluar application [which you can find in root directory]

- how to apply?

```
jhipster jdl ./example.jdl --skip-install --skip-git --no-insight --skip-jhipster-dependencies 
```