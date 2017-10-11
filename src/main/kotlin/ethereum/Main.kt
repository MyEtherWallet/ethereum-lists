package ethereum

import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser
import com.beust.klaxon.string
import java.io.File

fun main(args: Array<String>) {
    check("tokens", {
        it.checkFields(
                mandatoryFields = listOf("name", "symbol", "address", "decimals"),
                optionalFields = listOf("logo", "support", "community", "website", "github", "img-16x16", "img-128x128", "social")
        )
    })
    check("addresses", { it.checkFields(mandatoryFields = listOf("address", "comment"), optionalFields = listOf("date")) })
    check("urls", { it.checkFields(mandatoryFields = listOf("id"), optionalFields = listOf("comment")) })
    check("ens", { it.checkFields(mandatoryFields = listOf("id", "comment")) })
    check("contracts", { it.checkFields(mandatoryFields = listOf("name", "address", "abi"), optionalFields = listOf("comment")) })
    check("emails", { it.checkEmails() })

}

fun check(directoryName: String, checkFunction: (file: File) -> Unit) {
    File(directoryName).listFiles { _, name -> name.endsWith(".json") }.forEach { jsonFile ->
        println("processing $directoryName $jsonFile")
        checkFunction(jsonFile)
    }
}

val EMAIL_REGEX = Regex("(?:[a-z0-9!#\$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#\$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])")

fun File.toJSONArray() = Parser().parse(this.reader()) as JsonArray<*>
fun File.checkEmails() {
    toJSONArray().map { it as String }.forEach { email ->
        if (!EMAIL_REGEX.matches(email)) {
            throw IllegalArgumentException("invalid email $email")
        }
    }
}

fun File.checkFields(mandatoryFields: List<String>, optionalFields: List<String> = listOf()) {
    val jsonObjectList = toJSONArray().map { it as JsonObject }
    jsonObjectList.forEach { jsonObject ->
        if (!jsonObject.keys.containsAll(mandatoryFields)) {
            throw IllegalArgumentException("$jsonObject does not contain " + mandatoryFields.minus(jsonObject.keys))
        }

        mandatoryFields.forEach {
            if (jsonObject[it] is String && jsonObject.string(it)?.isBlank() == true) {
                throw IllegalArgumentException("$jsonObject has blank value for $it")
            }
        }


        val unknownFields = jsonObject.keys.minus(mandatoryFields.plus(optionalFields))
        if (unknownFields.isNotEmpty()) {
            throw IllegalArgumentException("$jsonObject contains unknown " + unknownFields)
        }

    }
    if (!optionalFields.isEmpty()) {
        val minimalJSONArray = JsonArray<JsonObject>()
        jsonObjectList.forEach { jsonObject ->
            val minimalJsonObject = JsonObject()
            mandatoryFields.forEach {
                minimalJsonObject.put(it, jsonObject[it])
            }
            minimalJSONArray.add(minimalJsonObject)
        }

        File("build/output").mkdir()
        File("build/output", name.replace(".json", ".min.json")).writeText(minimalJSONArray.toJsonString())
    }
}
