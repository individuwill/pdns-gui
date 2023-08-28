'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function ZoneList(props: any) {
    const {zones, selectedZone, changeZone} = props;
    function activeClass(zoneID: string) {
      return (selectedZone.id === zoneID) ? 'active' : '';
    };
    function handleClick(event, zoneID: string) {
      changeZone(zoneID);
      event.preventDefault();
      return false;
    }
    return(
      <div>
        <button type="button" className="btn btn-secondary float-end bm-3" onClick={(event) => (event.preventDefault())}><FontAwesomeIcon icon={faPlus} /></button>
        <ul className="nav nav-tabs">
          {
            Object.keys(zones).map((zoneID: any) => (
              <li key={'zone-' + zoneID} className="nav-item">
                <a href="#" className={"nav-link " + activeClass(zoneID)} onClick={(event) => (handleClick(event, zoneID))}>{zoneID}</a>
              </li>
            ))
          }
        </ul>
       </div>
    );
}

function RecordRow({record, selectedRecord, changeRecord}:any) {
  function handleClick() {
    changeRecord(record);
  }
  function activeClass(recordID: string) {
    return (selectedRecord.id === recordID) ? 'table-active' : '';
  }
  return (
    <tr className={activeClass(record.id)} onClick={handleClick}>
      <td>
        <span>{record.name}</span>
      </td>
      <td>
        {record.type}
      </td>
      <td>
        {record.content}
      </td>
      <td>
        {record.disabled.toString()}
      </td>
    </tr>
  );
}

function ZoneDetail({zone, selectedRecord, changeRecord}: any) {
    return (
      <div>
        <table className="table table-hover border-start border-end">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Content</th>
              <th scope="col">Disabled</th>
            </tr>
          </thead>
          <tbody>
            {
              zone.records.map((record: any) => (
                <RecordRow record={record} key={record.id} changeRecord={changeRecord} selectedRecord={selectedRecord} />
              ))
            }
          </tbody>
        </table>
      </div>
    );
}

export function RecordForm({zone, record, changeRecord}: any) {
  function handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    console.log('handleChange', name, value);
    record[name] = value;
    changeRecord(record);
  }

  return (
    <div>
      <form>
        <div className="row">
          <div className="col mb-1">
            <div className="input-group">
              <div className="form-floating">
                <input id="name" type="text" name="name" className="form-control" placeholder="Name" value={record.name} onChange={handleChange} />
                <label htmlFor="name" className="form-label">Name</label>
              </div>
              
              <span className="input-group-text">.{zone.name}</span>
            </div>
          </div>
        </div>
      <div className="row">
        <div className="col">
          <div className="form-floating mb-1">
            <input id="content" type="text" name="content" className="form-control" placeholder="Content" value={record.content} onChange={handleChange} />
            <label htmlFor="content" className="form-label">Content</label>
          </div>
        </div>
      </div>
        <div className="row">
          <div className="col">
            <div className="form-floating mb-1">
              <select id="type" name="type" className="form-select" value={record.type} onChange={handleChange}>
                <option value="">---</option>
                <option value="A">A</option>
                <option value="TXT">TXT</option>
                <option value="CNAME">CNAME</option>
                <option value="MX">MX</option>
                <option value="NS">NS</option>
                <option value="PTR">PTR</option>
                <option value="SOA">SOA</option>
                <option value="SRV">SRV</option>
              </select>
              <label htmlFor="type" className="form-label">Type</label>
            </div>
          </div>
          <div className="col">
            <div className="form-floating mb-1">
              <input id="ttl" type="text" name="ttl" className="form-control" placeholder="TTL" value={record.ttl} onChange={handleChange} />
              <label htmlFor="ttl" className="form-label">TTL</label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-check mb-1">
              <label htmlFor="disabled" className="form-check-label">Disabled</label>
              <input type="checkbox" name="disabled" className="form-check-input" value={record.disabled} onChange={handleChange} />
            </div>
          </div>
          <div className="col">
            <button type="button" className="btn btn-primary">Save</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default function ZoneControl({servers}: any) {
  const [selectedServer, setSelectedServer] = React.useState(servers[Object.keys(servers)[0]]);
  const [selectedZone, setSelectedZone] = React.useState(selectedServer.zones[Object.keys(selectedServer.zones)[0]]);
  const [selectedRecord, setSelectedRecord] = React.useState({
    id: '',
    name: '',
    type: '',
    content: '',
    ttl: '',
    disabled: false
  });

  function changeZone(zoneId) {
    console.debug('changeZone', zoneId);
    setSelectedZone(selectedServer.zones[zoneId]);
  }

  function changeRecord(record) {
    console.debug('changeRecord', record);
    setSelectedRecord(JSON.parse(JSON.stringify(record)));
  }

  return(
    <div>
      <RecordForm zone={selectedZone} record={selectedRecord} changeRecord={changeRecord} />
      <ZoneList zones={selectedServer.zones} selectedZone={selectedZone} changeZone={changeZone} />
      <ZoneDetail zone={selectedZone} selectedRecord={selectedRecord} changeRecord={changeRecord} />
    </div>
  );
}