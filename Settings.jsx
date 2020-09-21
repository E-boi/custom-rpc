const { React } = require("powercord/webpack");
const { TextInput, SwitchItem } = require("powercord/components/settings");
const { Button } = require("powercord/components");
const path = require("path");

module.exports = ({ getSetting, updateSetting, toggleSetting }) => (
  <div>
    <SwitchItem
      note="Toggle RPC using the settings below."
      value={getSetting("rpcEnabled", true)}
      onChange={async () => {
          await toggleSetting("rpcEnabled");
          let thisPlugin = powercord.pluginManager.get(__dirname.split(path.sep).pop());
          if(getSetting("rpcEnabled") == true) {
            thisPlugin.rpc.enable();
          } else {
            thisPlugin.rpc.disable();
          }
        }
      }
    >
      Toggle RPC
    </SwitchItem>
    
    <TextInput
      //note="RPC Application ID"
      defaultValue={getSetting("rpcId", "711416957718757418")}
      required={true}
      onChange={val => {let thisPlugin = powercord.pluginManager.get(__dirname.split(path.sep).pop());thisPlugin.rpc.refresh(true); updateSetting("rpcId",val)}}
    >
      ID
    </TextInput>
    <TextInput
      //note="RPC Name"
      defaultValue={getSetting("rpcName", "Lightcord RPC")}
      required={true}
      onChange={val => {let thisPlugin = powercord.pluginManager.get(__dirname.split(path.sep).pop());thisPlugin.rpc.refresh(true); updateSetting("rpcName",val)}}
    >
      Name
    </TextInput>
    <TextInput
      //note="RPC State"
      defaultValue={getSetting("rpcState", "Powercord Client")}
      required={true}
      onChange={val => {let thisPlugin = powercord.pluginManager.get(__dirname.split(path.sep).pop());thisPlugin.rpc.refresh(true); updateSetting("rpcState",val)}}
    >
      State
    </TextInput>
    <TextInput
      //note="RPC Details"
      defaultValue={getSetting("rpcDetails", "Browsing Discord")}
      required={true}
      onChange={val => {let thisPlugin = powercord.pluginManager.get(__dirname.split(path.sep).pop());thisPlugin.rpc.refresh(true); updateSetting("rpcDetails",val)}}
    >
      Details
    </TextInput>
    <TextInput
      //note="RPC Small asset ID"
      defaultValue={getSetting("rpcSmallAsset", null)}
      required={true}
      onChange={val => {let thisPlugin = powercord.pluginManager.get(__dirname.split(path.sep).pop());thisPlugin.rpc.refresh(true); updateSetting("rpcSmallAsset",val)}}
    >
      Small asset ID
    </TextInput>
    <TextInput
      //note="RPC Large asset ID"
      defaultValue={getSetting("rpcLargeAsset", "757229873071784046")}
      required={true}
      onChange={val => {let thisPlugin = powercord.pluginManager.get(__dirname.split(path.sep).pop());thisPlugin.rpc.refresh(true); updateSetting("rpcLargeAsset",val)}}
    >
      Large asset ID
    </TextInput>
  </div>
);
