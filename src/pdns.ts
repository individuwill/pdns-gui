export enum ServerType {
  Server = "Server",
}

export class Server {
  id: string;
  zones: { [key: string]: Zone } = {};
  type: ServerType = ServerType.Server;

  constructor (id: string) {
    this.id = id;
  }
}

export enum ZoneKind {
  Master = "Master",
  Native = "Native",
  Slave = "Slave",
  Superslave = "Superslave",
  Hint = "Hint",
  Forward = "Forward",
  Stub = "Stub",
  DelegationOnly = "DelegationOnly",
}

export class Zone {
  id: string;
  name: string;
  kind: ZoneKind = ZoneKind.Native;
  serial: number = 0;
  dnssec: boolean = false;
  records: Record[] = [];

  constructor(id: string) {
    this.id = id;
    this.name = id;
  }
}

export enum RecordType {
  A = "A",
  AAAA = "AAAA",
  CNAME = "CNAME",
  MX = "MX",
  NS = "NS",
  PTR = "PTR",
  SOA = "SOA",
  SRV = "SRV",
  TXT = "TXT",
}

export class Record {
  name: string;
  ttl: number;
  type: RecordType;
  content: string;
  disabled: boolean;
  id: string;

  constructor(id:string, name: string, ttl: number, type: RecordType, content: string, disabled: boolean) {
    this.id = id;
    this.name = name;
    this.ttl = ttl;
    this.type = type;
    this.content = content;
    this.disabled = disabled;
  }
}

export default class PDNSAPI {
  baseURL: string;
  headers: Headers;

  constructor(protocol: string, host: string, port: string, apikey: string) {
    this.baseURL = `${protocol}://${host}:${port}/api/v1`;
    this.headers = new Headers({
      "Accept": 'application/json',
      "Content-Type": "application/json",
      "X-API-Key": apikey
    });
  }

  async handleRequest(path: string, options: RequestInit | null=null) {
    path = path.startsWith('/') ? path : `/${path}`;
    if (!options) {
      options = {method: 'GET', headers: this.headers};
    }
    const url = `${this.baseURL}${path}`;
    const data = await fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`)
        }
        return response.json();
      });
    console.log(data);
    return data;
  }

  async getAll(): Promise<{ [key: string]: Server }> {
    const servers = await this.getServers();
    for (const [serverName, server] of Object.entries(servers)) {
      console.debug(serverName);
      const zones = await this.getZones(serverName);
      for (const [zoneName, zone] of Object.entries(zones)) {
        console.debug(zoneName);
        const zoneDetail = await this.getZone(serverName, zoneName);
        servers[serverName].zones[zoneName] = zoneDetail;
      }
    }
    return servers;
  }

  async getServers(): Promise<{ [key: string]: Server }> {
    const _servers = await this._getServers();
    const servers: { [key: string]: Server } = {};
    for (const server of _servers) {
      servers[server.id] = new Server(server.id);
    }
    return servers;
  }

  async getZones(server:string="localhost"): Promise<{ [key: string]: Zone }> {
    const _zones = await this._getZones(server);
    const zones: { [key: string]: Zone } = {};
    for (const zone of _zones) {
      zones[zone.id] = new Zone(zone.id);
    }
    return zones;
  }

  async getZone(server: string, zoneID: string): Promise<Zone> {
    const _zone = await this._getZone(server, zoneID);
    const zone = new Zone(_zone.id);
    for (const _record of _zone.rrsets) {
      const record = new Record(
        _record.name + '-' + _record.type,
        _record.name,
        _record.ttl,
        _record.type,
        _record.records[0].content,
        _record.records[0].disabled
      );
      zone.records.push(record);
    }
    return zone;
  }

  _getServers() {
    return this.handleRequest("/servers");
  }

  _getZones(server:string="localhost") {
    return this.handleRequest(`/servers/${server}/zones`);
  }

  _getZone(server: string, zoneID: string) {
    return this.handleRequest(`/servers/${server}/zones/${zoneID}`);
  }

  addZone() {

  }

  addRecord() {

  }
}