{

    // twixtor-batch-operation-script.jsx
    // Author: Yijun Yan (https://github.com/yanyiju)

    function twixtor_batch_operator(thisObj)
    {
        function TBO_buildUI(thisObj)
        {
            var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Twixtor Batch Operation Script", undefined);
            win.spacing = 5;

            // const graphic size variables
            const textWidth = 200;
            const inputWidth = 300;
            const halfSizeWidth = (textWidth + inputWidth) / 2;

            // dropdown list choice data collection (initialization)
            var curComp = getCurrentComp();
            var activeLayerIDs = getActiveLayerIDs(app.project.activeItem);
            var activeLayerNames = getActiveLayerNames(curComp, activeLayerIDs);

            // Group of current active item display
            var activeItemDisplayGroup = win.add("group", undefined, "active item display");
                activeItemDisplayGroup.orientation = "row";
                activeItemDisplayGroup.alignChildren = "left";
                var displayText = activeItemDisplayGroup.add("statictext", undefined, "Current item: ");
                    displayText.preferredSize.width = textWidth;
                var displayItem = activeItemDisplayGroup.add("edittext", undefined, curComp === null ? "???" : curComp.name, {readonly: true});
                    displayItem.preferredSize.width = inputWidth;

            // Group of output frame rate setting
            var outputFrameRateGroup = win.add("group", undefined, "Output Frame Rate Group");
                outputFrameRateGroup.orientation = "row";
                outputFrameRateGroup.alignChildren = "left";
                var outputFrameRateText = outputFrameRateGroup.add("statictext", undefined, "Output Frame Rate: ");
                    outputFrameRateText.preferredSize.width = textWidth;
                var outputFrameRate = outputFrameRateGroup.add("edittext", undefined, 60);
                    outputFrameRate.preferredSize.width = inputWidth;

            // Group of layer choices
            var targetLayerGroup = win.add("group", undefined, "target layer");
                targetLayerGroup.alignChildren = "top";
                var layerText = targetLayerGroup.add("statictext", undefined, "Target layer: ");
                    layerText.preferredSize.width = textWidth;
                var layerSelectionGroup = targetLayerGroup.add("group", undefined, "selection");
                    layerSelectionGroup.orientation = "column";
                    layerSelectionGroup.alignChildren = "left";
                    var layerDD = layerSelectionGroup.add("dropdownlist", undefined, activeLayerNames);
                        layerDD.preferredSize.width = inputWidth;
                        layerDD.selection = 0;
                    var checkbox = layerSelectionGroup.add("checkbox", undefined, "Select all video layers.");
                    
            // Panel of twixtor params
            var twixtorParamPanel = win.add("panel", undefined, "Twixtor Parameters");
                twixtorParamPanel.orientation = "column";
                var repetitiveFrameRateGroup = twixtorParamPanel.add("group", undefined, "Repetitive Frame Rate Group");
                    repetitiveFrameRateGroup.orientation = "row";
                    var repetitiveFrameRateText = repetitiveFrameRateGroup.add("statictext", undefined, "Repetitive Frame Rate: ");
                        repetitiveFrameRateText.preferredSize.width = textWidth;
                    var repetitiveFrameRate = repetitiveFrameRateGroup.add("edittext", undefined, 2);
                        repetitiveFrameRate.preferredSize.width = inputWidth;
                var useGpuGroup = twixtorParamPanel.add("group", undefined, "useGPU");
                    useGpuGroup.orientation = "row";
                    var useGpuText = useGpuGroup.add("statictext", undefined, "Use GPU: ");
                        useGpuText.preferredSize.width = textWidth;
                    var useGpuDD = useGpuGroup.add("dropdownlist", undefined, ["OFF", "ON"]);
                        useGpuDD.preferredSize.width = inputWidth;
                        useGpuDD.selection = 0;
                var imagePrepGroup = twixtorParamPanel.add("group", undefined, "imagePrep");
                    imagePrepGroup.orientation = "row";
                    var imagePrepText = imagePrepGroup.add("statictext", undefined, "Image Prep: ");
                        imagePrepText.preferredSize.width = textWidth;
                    var imagePrepDD = imagePrepGroup.add("dropdownlist", undefined, ["None", "Contrast/Edge Enhance", "Delinearize"]);
                        imagePrepDD.preferredSize.width = inputWidth;
                        imagePrepDD.selection = 0;
                var speedGroup = twixtorParamPanel.add("group", undefined, "speed");
                    speedGroup.orientation = "row";
                    var speedText = speedGroup.add("statictext", undefined, "Speed %: ");
                        speedText.preferredSize.width = textWidth;
                    var speed = speedGroup.add("edittext", undefined, 100);
                        speed.preferredSize.width = inputWidth;
                var frameInterpGroup = twixtorParamPanel.add("group", undefined, "frameInterp");
                    frameInterpGroup.orientation = "row";
                    var frameInterpText = frameInterpGroup.add("statictext", undefined, "Frame Interp: ");
                        frameInterpText.preferredSize.width = textWidth;
                    var frameInterpDD = frameInterpGroup.add("dropdownlist", undefined, ["Nearest", "Blend", "Motion Weighted Blend"]);
                        frameInterpDD.preferredSize.width = inputWidth;
                        frameInterpDD.selection = 1;
                var warpingGroup = twixtorParamPanel.add("group", undefined, "warping");
                    warpingGroup.orientation = "row";
                    var warpingText = warpingGroup.add("statictext", undefined, "Warping: ");
                        warpingText.preferredSize.width = textWidth;
                    var warpingDD = warpingGroup.add("dropdownlist", undefined, ["Inverse", "Inverse w/ Smart Blend", "Forward", "Forward, no Smart Blend"]);
                        warpingDD.preferredSize.width = inputWidth;
                        warpingDD.selection = 0;
                var mainBgSensitivityGroup = twixtorParamPanel.add("group", undefined, "mainBgSensitivity");
                    mainBgSensitivityGroup.orientation = "row";
                    var mainBgSensitivityText = mainBgSensitivityGroup.add("statictext", undefined, "Main_BG Sensitivity: ");
                        mainBgSensitivityText.preferredSize.width = textWidth;
                    var mainBgSensitivity = mainBgSensitivityGroup.add("edittext", undefined, 100);
                        mainBgSensitivity.preferredSize.width = inputWidth;

            // function of retrieving param inputs from twixtor panel
            function getTwixtorParams(comp)
            {
                if (isValid(repetitiveFrameRate.text) && isValid(mainBgSensitivity.text) && isValid(speed.text)) {
                    var twixtorParams = new Object();
                    twixtorParams["Use GPU"] = useGpuDD.selection.index + 1;
                    twixtorParams["In FPS is Out FPS"] = 0;
                    twixtorParams["Input: Frame Rate"] = 1/comp.layer(1).source.frameDuration/Number(repetitiveFrameRate.text);
                    twixtorParams["Main_BG Sensitivity"] = Number(mainBgSensitivity.text);
                    twixtorParams["Image Prep"] = imagePrepDD.selection.index + 1;
                    twixtorParams["Speed %"] = Number(speed.text);
                    twixtorParams["Warping"] = warpingDD.selection.index + 1;
                    twixtorParams["Frame Interp"] = frameInterpDD.selection.index + 1;
                    return twixtorParams;
                } else {
                    throw "Error occurred during twixtor param collecting: Only number values can be accepted.";
                }
            }

            // Group of buttons
            var buttonGroup = win.add("group {alignment: 'right'}", undefined, "button");
                buttonGroup.orientation = "row";
                buttonGroup.margins.top = 15;
                var helpBtnGroup = buttonGroup.add("group", undefined, "helpBtnGroup");
                    helpBtnGroup.preferredSize.width = halfSizeWidth;
                    helpBtnGroup.alignment = "left";
                    var helpBtn = helpBtnGroup.add("button", undefined, "Help/About this script");
                        helpBtn.onClick = function() {
                            var helpWin = new Window("palette", "Help", undefined);
                            var infoText = "This private script is totally free to use and available on Github.\n" + 
                                "Github page: https://github.com/yanyiju/twixtor-batch-operation-script\n" +
                                "You can raise any of your questions in the issue tab.\n" + 
                                "Thanks for your feedback.\n\n" +
                                "© Copyright Yijun Yan 2021";
                            var info = helpWin.add("statictext", undefined, infoText, {multiline:true});
                            info.preferredSize.width = 400;
                            helpWin.onResizing = helpWin.onResize = function(){this.layout.resize();};
                            helpWin instanceof Window
                                ? (helpWin.center(), helpWin.show()) : (helpWin.layout.layout(true), helpWin.layout.resize());
                        }
                var operationBtnGroup = buttonGroup.add("group", undefined, "operationBtnGroup");
                    operationBtnGroup.orientation = "row";
                    operationBtnGroup.preferredSize.width = halfSizeWidth;
                    var refreshBtn = operationBtnGroup.add("button", undefined, "Refresh Current Item");
                        refreshBtn.onClick = function(){
                            curComp = getCurrentComp();
                            activeLayerIDs = getActiveLayerIDs(curComp);
                            activeLayerNames = getActiveLayerNames(curComp, activeLayerIDs);
                            if (curComp != null) {
                                refreshDisplay(displayItem, curComp.name);
                            } else {
                                alert("No active composition detected! Please open or select a composition.");
                            }
                            refreshDD(layerDD, activeLayerNames);
                        };
                    var actBtn = operationBtnGroup.add("button", undefined, "Here we go!!!");
                        actBtn.onClick = function(){
                            // when curComp is null
                            if (curComp == null) {
                                alert("You haven't selected an composition!");
                                return;
                            }

                            // build folder structure
                            var scriptFolder = getFolderItemByName(scriptFolderName, null);
                            var precompFolder = getFolderItemByName(precompFolderName, scriptFolder);
                            var curCompFolder = getFolderItemByName(curComp.name, precompFolder);
                            var curPrecomp1Folder = getFolderItemByName("precomp1", curCompFolder);
                            var curPrecomp2Folder = getFolderItemByName("precomp2", curCompFolder);

                            // find the final result comp for user to operate, or create a new one if not existed
                            var resultCompName = curComp.name + "_script";
                            var resultCompBackupName = resultCompName + "_backup";
                            var resultComp = checkItemInFolder(resultCompName, CompItem, scriptFolder);
                            var resultCompBackup = checkItemInFolder(resultCompBackupName, CompItem, scriptFolder);
                            var isInitialOperation = resultComp == null;
                            if (resultComp == null) {
                                resultComp = curComp.duplicate();
                                resultComp.parentFolder = scriptFolder;
                                resultComp.name = resultCompName;
                            } 
                            if (resultCompBackup != null) {
                                resultCompBackup.remove();
                            }
                            resultCompBackup = resultComp.duplicate();
                            resultCompBackup.name = resultCompBackupName;

                            // 'precomps' stores all script-built comps during this click action
                            var precomps = [];

                            // build twixtor-related structure
                            try {
                                // set the frame rate of result comp
                                if (isValid(outputFrameRate.text)) {
                                    resultComp.frameDuration = 1/Number(outputFrameRate.text);
                                } else {
                                    throw "Only number values can be accepted in output frame rate setting.";
                                }

                                // get all target layers' ids
                                var targetLayerIDs = null;
                                if (layerDD.selection != null) {
                                    targetLayerIDs = [activeLayerIDs[layerDD.selection.index]];
                                }
                                if (checkbox.value) {
                                    targetLayerIDs = activeLayerIDs;
                                }

                                // main service part
                                for (var i = 0; i < targetLayerIDs.length; i++) {
                                    var twixtorParams = getTwixtorParams(curComp);
                                    var targetLayerID = targetLayerIDs[i];
                                    var targetLayerName = resultComp.layer(targetLayerID).name;
                                    if (targetLayerName.match(/[\S]+_precomp2/) != null) {
                                        alert("Comp (" + targetLayerName + ") already exists. Ignored!");
                                    } else if (twixtorParams != undefined) {
                                        var comps = precomposeAndApplyTwixtor(resultComp, targetLayerID, twixtorParams, curPrecomp1Folder, curPrecomp2Folder);
                                        precomps = precomps.concat(comps);
                                    }
                                }

                                // update and display result comp
                                resultComp.openInViewer().setActive();
                                resultCompBackup.remove();
                            } catch(err) {
                                // remove the new-built comps in this operation        
                                for (var i = 0; i < precomps.length; i++) {
                                    precomps[i].remove();
                                }

                                // recover the original result comp if it existed
                                resultComp.remove();
                                if (isInitialOperation) {
                                    resultCompBackup.remove();
                                } else {
                                    resultCompBackup.name = resultCompName;
                                }

                                alert(err);
                            }
                        };

            win.onResizing = win.onResize = function() {
                this.layout.resize();
            };
    
            win instanceof Window
                ? (win.center(), win.show()) : (win.layout.layout(true), win.layout.resize());
        }

        
        // SERVICE FUNCTIONS

        // get current active comp
        // priority: selComp > actComp > compInViewer
        function getCurrentComp(){
            var actComp = app.project.activeItem;
            var selComp = app.project.selection.length === 1 && app.project.selection[0].typeName === "Composition" ? app.project.selection[0] : null;

            // priority: selComp > actComp > comp in active viewer
            if (selComp !== null) {
                return selComp;
            } else if (actComp instanceof CompItem) {
                return actComp;
            } else {
                var isCompInViewer = (app.activeViewer && app.activeViewer.type === ViewerType.VIEWER_COMPOSITION);
                if (isCompInViewer) {
                    app.activeViewer.setActive();
                    return app.project.activeItem;
                }
            }
            return null;
        };

        // main service function: build precomps and add twixtor effects over precomp1 layers
        // precomp2 layers are used for speed adjusting in final comp
        function precomposeAndApplyTwixtor(comp, layerID, twixtorParams, precomp1Folder, precomp2Folder)
        {
            try {
                // define the names of 2 precomp
                var prefixName = comp.name + "_" + comp.layer(layerID).name + "_" + layerID.toString();
                var firstCompName = prefixName + "_precomp1";
                var secondCompName = prefixName + "_precomp2";

                // precompose the layer (first time)
                var firstComp = checkItemInFolder(firstCompName, CompItem, precomp1Folder);
                if (firstComp == null) {
                    firstComp = timeFitPrecompose(comp, firstCompName, layerID);
                    firstComp.parentFolder = precomp1Folder;
                } else {
                    replaceLayer(comp, layerID, firstComp);
                }

                // precompose the layer again (second time)
                var secondComp = checkItemInFolder(secondCompName, CompItem, precomp2Folder);
                if (secondComp == null) {
                    var firstCompID = comp.layer(firstCompName).index;
                    secondComp = timeFitPrecompose(comp, secondCompName, firstCompID);
                    secondComp.parentFolder = precomp2Folder;
                } else {
                    replaceLayer(comp, firstCompID, secondComp);
                }

                // add twixtor in second comp over the first-comp layer
                addTwixtorEffect(secondComp, twixtorParams);

                return [firstComp, secondComp];
            } catch(err) {
                throw("Error happens during precomposeAndApplyTwixtor: " + err);
            }
        }

        // get a folder item based on name, or create a new one if not existed
        function getFolderItemByName(folderName, parentFolder)
        {
            var folder = checkItemInFolder(folderName, FolderItem, parentFolder);
            if (folder == null) {
                if (parentFolder == null) {
                    parentFolder = app.project;
                }
                folder = parentFolder.items.addFolder(folderName);
            }
            return folder;
        }

        // get all active video layers in one comp
        function getActiveLayerIDs(comp)
        {
            var activeLayerIDs = [];
            if (comp !== null) {
                for (var i = 1; i <= comp.numLayers; i++) {
                    if (isVideoLayer(comp.layer(i))) {
                        activeLayerIDs.push(i);
                    }
                }
            }
            return activeLayerIDs;
        }

        // get names of all active video layers, consistent with getActiveLayerIDs in size
        function getActiveLayerNames(comp)
        {
            if (comp === null) return [];
            var activeLayerNames = [];
            for (var i = 1; i <= comp.numLayers; i++) {
                if (isVideoLayer(comp.layer(i))) {
                    activeLayerNames.push("Layer " + i.toString() + ": " + comp.layer(i).name);
                }
            }
            return activeLayerNames;
        }

        // mainly used for refreshing static text
        function refreshDisplay(control, name){control.text = name;}

        // refresh dropdown list
        function refreshDD(dd, list)
        {
            dd.removeAll();
            for (var i = 0; i < list.length; i++) {
                dd.add("item", list[i]);
            }
            dd.selection = 0;
        }

        // UTILITY FUNCTIONS

        // return true for footage layers
        function isVideoLayer(layer){return isVideoItem(layer.source);}

        // return true for comp item or video item
        // return false for solid item, image item, audio item, etc.
        function isVideoItem(item){return item.duration > 0 && item.hasVideo == true;}

        // replace a layer in a certain comp with a new item
        function replaceLayer(comp, layerID, item) {
            // replace a layer with a specified item
            var oldLayer = comp.layer(layerID);
            var startTime = oldLayer.startTime;
            oldLayer.remove();
            var replacedLayer = comp.layers.add(item);
            replacedLayer.startTime = startTime;
            if (replacedLayer.index != layerID) {
                replacedLayer.moveBefore(comp.layer(layerID));
            }
        }

        // check if the folder has an item with specified name and type
        function checkItemInFolder(itemName, itemType, folder)
        {
            if (folder == null) {
                folder = app.project;
            }
            for (var i = 1; i <= folder.numItems; i++) {
                if (folder.item(i) instanceof itemType && folder.item(i).name == itemName) {
                    return folder.item(i);
                }
            }
        }

        // add twixtor effect with specified params
        function addTwixtorEffect(comp, twixtorParams)
        {
            if (comp.numLayers != 1) {
                throw "Composition " + comp.name + " is not a single-layer comp. Please check!";
            }
            var targetLayer = comp.layer(1);

            // Add Twixtor Pro effect
            targetLayer.property("Effects").addProperty(twixtorEffectName);
            
            // Adjust parameters
            for (var param in twixtorParams) {
                targetLayer.effect(twixtorEffectName)(param).setValue(twixtorParams[param]);
            }
        }

        // precompose a single layer with remaining the original start/end timing
        function timeFitPrecompose(comp, newCompName, layerID)
        {
            // some data needed for later setting timing
            var inPoint = comp.layer(layerID).inPoint;
            var outPoint = comp.layer(layerID).outPoint;
            var duration = outPoint - inPoint;

            // precompose
            var newComp = comp.layers.precompose([layerID], newCompName, true);

            // timing adjusting
            newComp.layer(1).startTime -= inPoint;
            newComp.duration = duration;
            comp.layer(newCompName).startTime = inPoint;

            return newComp;
        }

        // justify if the param data is valid
        function isValid(value) {
            return !isNaN(value) && Number(value) >= 0;
        }

        const twixtorEffectName = "Twixtor Pro";
        const scriptFolderName = "twixtor-batch-operation-script-folder";
        const precompFolderName = "script-built-comp-folder";

        TBO_buildUI(thisObj);
    }

    twixtor_batch_operator(this);  
}