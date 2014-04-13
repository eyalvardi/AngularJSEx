AngularJSEx
===========

1. AngularEx.Base.js goals: 
  - Create a referance to main module. 
  - Expose plugins array that executing after document readey.
  - Expose addRequireTongApp method. When you whant to add referance to the main module 
    You do not know who it is the main module, Just after the document readey is fire.

2. AngularEx.ModulesDumper.js goals:
   - Expose getModulesTree method. This method return json object of module tree.
   - Expose printModuleTree method. This method print the tree to console.

3. AngularEx.SimplifyRequires.js
   - Each module is created, Add to the requires of the main module automatic.
   - If you try to get module and it doesn't exist, It create it.
