package ethereum

import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.Parser
import java.io.File

fun main(args: Array<String>) {
    check("tokens", {
        it.checkFields(
                mandatoryFields = listOf("name", "symbol", "address", "decimals"),
                optionalFields = listOf("logo", "support", "community", "website", "github", "img-16x16", "img-128x128", "social")
        )
    })
    check("addresses", { it.checkFields(mandatoryFields = listOf("address", "comment", "date")) })
    check("urls", { it.checkFields(mandatoryFields = listOf("id", "comment")) })
    check("ens", { it.checkFields(mandatoryFields = listOf("id", "comment")) })
    check("contracts", { it.checkFields(mandatoryFields = listOf("name", "address", "comment", "abi")) })
    check("emails", { it.checkEmails() })

}

fun check(directoryName: String, checkFunction: (array: JsonArray<*>) -> Unit) {
    File(directoryName).listFiles { _, name -> name.endsWith(".json") }.forEach { it ->
        println("processing $directoryName $it")
        checkFunction(Parser().parse(it.reader()) as JsonArray<*>)
    }
}

val EMAIL_REGEX = Regex("(?:[a-z0-9!#\$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#\$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])")

fun JsonArray<*>.checkEmails() {
    map { it as String }.forEach { email ->
        if (!EMAIL_REGEX.matches(email)) {
            throw IllegalArgumentException("invalid email $email")
        }
    }
}

fun JsonArray<*>.checkFields(mandatoryFields: List<String>, optionalFields: List<String> = listOf()) {
    map { it as JsonObject }.forEach { jsonObject ->
        if (!jsonObject.keys.containsAll(mandatoryFields)) {
            throw IllegalArgumentException("$jsonObject does not contain " + mandatoryFields.minus(jsonObject.keys))
        }

        val unknownFields = jsonObject.keys.minus(mandatoryFields.plus(optionalFields))
        if (unknownFields.isNotEmpty()) {
            throw IllegalArgumentException("$jsonObject contains unknown " + unknownFields)
        }
    }
}
