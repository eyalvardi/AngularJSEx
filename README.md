AngularJSEx
===========

1. AngularEx.Base.js goals: 
  - Create a referance to main module. 
  - Expose plugins array that executing after document ready.
  - Expose addRequireTongApp method. When you whant to add referance to the main module 
    You do not know who it is the main module, Just after the document ready is fire.

2. AngularEx.ModulesDumper.js goals: (Dependent on AngularEx.Base.js )
   - Expose getModulesTree method. This method return json object of module tree.
   - Expose printModuleTree method. This method print the tree to console.

3. AngularEx.Directives.js goals: (Dependent on AngularEx.ModulesDumper.js and base )
   - angularex directive build modules treeview. The tree will open and close by clicking on the '+' button.

4. AngularEx.SimplifyRequires.js goals: (Dependent on AngularEx.Base.js )
   - Each module is created, Add to the requires of the main module automatic.
   - If you try to get module and it doesn't exist, It create it.
