# Developer Guide for DevTools

## How ABI getting works?

__Participants__:

- "TON Verifier Registry" - TON Verifier smart contract that correspond contract state init `code` with "Source item" smart contract addres
- "Source item" - specific for `code` smart contract that stores IPFS url leading "Root source file"
- "Root source file" - JSON file with list of all source code file IPFS urls for specific contract
- "Source file" - source file item (e.g. ".pkg"/".tact"/".abi" file)
 
```mermaid
sequenceDiagram
  actor user as User
  participant ui as Minter UI
  participant registry as "TON Verifier Registry"<br />smart contract
  participant source_item as "Source item"<br />smart contract
  participant ipfs_source_root as Root source file
  participant ipfs_source_file as "Source file"

  user ->> ui: HTTP GET /manage/{address}
  activate ui

  ui ->> registry: run getter "get_source_item_address"
  activate registry
  registry -->> ui: "Source item" smart contract address
  deactivate registry

  ui ->> source_item: run getter "get_source_item_data"
  activate source_item
  source_item -->> ui: "Root source file" IPFS url
  deactivate source_item

  ui ->> ipfs_source_root: fetch via IPFS
  activate ipfs_source_root
  ipfs_source_root -->> ui: 
  deactivate ipfs_source_root

  loop Each file
  ui ->> ipfs_source_file: fetch via IPFS
  activate ipfs_source_file
  ipfs_source_file -->> ui: 
  deactivate ipfs_source_file
  end

  ui -->> user: ABI

  deactivate ui
```
