import assert = require("assert");
import { Form } from "../components/form/form";

describe("IDataBinder", () => {
  it("Get and set with key values", () => {
    const db = Form.jsonDataBinder({ name: "keith", address: { line1: "home" } })
    const setKeyValue = db.setKeyValue
    const getKeyValue = db.getKeyValue
    setKeyValue("name", "alan")
    assert.equal(getKeyValue("name"), "alan")

    setKeyValue(a => a.prop("name"), "alan1")
    assert.equal(getKeyValue(a => a.prop("name")), "alan1")

    setKeyValue(a => a.prop("address").prop("line1"), "alan1")
    assert.equal(getKeyValue(a => a.prop("address").prop("line1")), "alan1")
  })

  it("Child Data Binder", () => {
    const db = Form.jsonDataBinder({ name: "keith", address: { line1: "home" } })

    const getKeyValue = db.getKeyValue
    // const cdb = db.createChildBinder(b => b.prop("address"))
    const cdb = db.createChildBinder("address")
    const getChildKeyValue = cdb.getKeyValue
    const setChildKeyValue = cdb.setKeyValue
    assert.equal(getChildKeyValue("line1"), "home")
    setChildKeyValue("line1", "away")
    assert.equal(getChildKeyValue(b => b.prop("line1")), "away")
    assert.equal(getKeyValue(b => b.prop("address").prop("line1")), "home")
    cdb.sync()
    assert.equal(getKeyValue(b => b.prop("address").prop("line1")), "away")
    setChildKeyValue("line1", "home and away")
    assert.equal(getKeyValue(b => b.prop("address").prop("line1")), "away")
    cdb.sync()
    assert.equal(getKeyValue(b => b.prop("address").prop("line1")), "home and away")
  })
})
